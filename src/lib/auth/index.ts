import NextAuth from 'next-auth';
import { authOptions } from './config';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authOptions,
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
});

