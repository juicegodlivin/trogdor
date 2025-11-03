import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { verifyWalletSignature } from './verify-signature';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { redis } from '@/lib/redis';

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: 'solana',
      name: 'Solana Wallet',
      credentials: {
        publicKey: { label: 'Public Key', type: 'text' },
        signature: { label: 'Signature', type: 'text' },
        message: { label: 'Message', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.publicKey || !credentials?.signature || !credentials?.message) {
          return null;
        }

        // Type assertion for credentials
        const publicKey = credentials.publicKey as string;
        const signature = credentials.signature as string;
        const message = credentials.message as string;

        try {
          // Verify the signature
          const isValid = await verifyWalletSignature(
            publicKey,
            signature,
            message
          );

          if (!isValid) {
            console.error('Invalid signature');
            return null;
          }

          // Verify nonce hasn't been used (extract from message)
          const nonceMatch = message.match(/nonce: ([a-z0-9]+)/i);
          if (nonceMatch && redis) {
            try {
              const nonce = nonceMatch[1];
              const nonceExists = await redis.get(`nonce:pending:${nonce}`);
              
              if (!nonceExists) {
                console.error('Invalid or expired nonce');
                return null;
              }
              
              // Mark nonce as used
              await redis.del(`nonce:pending:${nonce}`);
              await redis.setex(`nonce:used:${nonce}`, 3600, '1'); // Store for 1 hour
            } catch (redisError) {
              console.error('Redis error during nonce verification:', redisError);
              // Continue without nonce verification if Redis fails
              console.warn('⚠️ Nonce verification skipped due to Redis error');
            }
          }

          // Find or create user
          const walletAddress = publicKey.toLowerCase();
          let [user] = await db
            .select()
            .from(users)
            .where(eq(users.walletAddress, walletAddress))
            .limit(1)
            .catch((err) => {
              console.error('Database error during user lookup:', err);
              throw err;
            });

          if (!user) {
            // Create new user
            [user] = await db
              .insert(users)
              .values({
                walletAddress,
                joinedAt: new Date(),
                lastActive: new Date(),
              })
              .returning()
              .catch((err) => {
                console.error('Database error during user creation:', err);
                throw err;
              });
          } else {
            // Update last active
            await db
              .update(users)
              .set({ lastActive: new Date() })
              .where(eq(users.id, user.id))
              .catch((err) => {
                console.error('Database error during user update:', err);
                // Don't throw - last active update is not critical
              });
          }

          return {
            id: user.id.toString(),
            walletAddress: user.walletAddress,
            name: user.username || undefined,
            image: user.profileImage || undefined,
          };
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.walletAddress = user.walletAddress;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.walletAddress = token.walletAddress as string;
      }

      return session;
    },
  },

  pages: {
    signIn: '/',
    error: '/',
  },

  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
} satisfies NextAuthConfig;

