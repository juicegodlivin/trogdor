'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import bs58 from 'bs58';

export function WalletConnectButton() {
  const { publicKey, signMessage, disconnect } = useWallet();
  const { data: session, status } = useSession();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hasAttemptedAuth, setHasAttemptedAuth] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset auth attempt flag when wallet changes
  useEffect(() => {
    if (!publicKey) {
      setHasAttemptedAuth(false);
    }
  }, [publicKey]);

  // Auto-authenticate when wallet connects (only if no session exists)
  useEffect(() => {
    async function authenticate() {
      // Wait for session to load before checking
      if (status === 'loading') {
        return;
      }

      // Don't authenticate if already have session, no wallet, already authenticating, or already attempted
      if (!publicKey || !signMessage || session || isAuthenticating || hasAttemptedAuth) {
        return;
      }

      try {
        setIsAuthenticating(true);
        setHasAttemptedAuth(true);
        
        console.log('🔐 Starting authentication for wallet:', publicKey.toString());

        // 1. Get nonce from server
        const nonceRes = await fetch('/api/auth/nonce');
        if (!nonceRes.ok) {
          throw new Error('Failed to fetch nonce');
        }
        const { nonce } = await nonceRes.json();
        console.log('✅ Nonce received:', nonce);

        // 2. Create message to sign
        const message = `Welcome to Trogdor the Burninator!\n\nSign this message to authenticate.\n\nNonce: ${nonce}`;
        
        // 3. Sign message with wallet
        console.log('📝 Requesting signature...');
        const encodedMessage = new TextEncoder().encode(message);
        const signature = await signMessage(encodedMessage);
        console.log('✅ Message signed');

        // 4. Authenticate with NextAuth
        console.log('🔑 Submitting to NextAuth...');
        const result = await signIn('solana', {
          publicKey: publicKey.toString(),
          signature: bs58.encode(signature),
          message,
          redirect: false,
        });

        if (result?.error) {
          console.error('❌ Authentication failed:', result.error);
          alert(`Authentication failed: ${result.error}\n\nPlease try disconnecting and reconnecting your wallet.`);
          setHasAttemptedAuth(false); // Allow retry
          await disconnect();
        } else {
          console.log('✅ Authentication successful!');
        }
      } catch (error: any) {
        console.error('❌ Authentication error:', error);
        setHasAttemptedAuth(false); // Allow retry on error
        // Only disconnect if user didn't cancel the signature
        if (error?.message !== 'User rejected the request.') {
          await disconnect();
        }
      } finally {
        setIsAuthenticating(false);
      }
    }

    authenticate();
  }, [publicKey, signMessage, session, status]);

  // Handle disconnect
  const handleDisconnect = async () => {
    await signOut({ redirect: false });
    await disconnect();
  };

  // Don't render until mounted (prevents hydration mismatch)
  if (!mounted) {
    return (
      <div className="btn-sketch px-4 py-2 text-sm font-medium opacity-50">
        Loading...
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-3">
        {/* Wallet Address - Clickable to Dashboard */}
        <a
          href="/dashboard"
          className="hidden sm:flex items-center gap-2 px-3 py-2 border-sketch hover:bg-accent-yellow/20 transition-colors"
        >
          <span className="text-lg">🐉</span>
          <div className="text-sm font-medium text-neutral-900">
            {session.user.walletAddress?.slice(0, 4)}...
            {session.user.walletAddress?.slice(-4)}
          </div>
        </a>
        
        {/* Mobile: Just icon */}
        <a
          href="/dashboard"
          className="sm:hidden flex items-center justify-center w-10 h-10 border-sketch hover:bg-accent-yellow/20 transition-colors"
        >
          <span className="text-2xl">🐉</span>
        </a>
        
        <button
          onClick={handleDisconnect}
          className="btn-sketch px-4 py-2 text-sm font-medium"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="wallet-adapter-button-wrapper relative">
      <WalletMultiButton className="btn-sketch !px-4 !py-2 !text-sm !font-medium" />
      {isAuthenticating && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded">
          <div className="animate-spin text-lg">🔥</div>
        </div>
      )}
    </div>
  );
}

