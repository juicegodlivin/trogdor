'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import bs58 from 'bs58';

export function WalletConnectButton() {
  const { publicKey, signMessage, disconnect, connected, wallet, connect, connecting } = useWallet();
  const { data: session, status } = useSession();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
    
    // Clear connect attempts on mount (allows fresh attempts on page reload)
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
      if (key.startsWith('trogdor_connect_attempted_')) {
        sessionStorage.removeItem(key);
      }
    });
  }, []);

  // Auto-connect when wallet is selected
  useEffect(() => {
    if (!mounted || !wallet || connected || connecting) return;

    const walletName = wallet.adapter.name;
    const connectKey = `trogdor_connect_attempted_${walletName}`;
    
    // Check if we already attempted to connect this wallet
    if (sessionStorage.getItem(connectKey) === 'true') return;
    
    // Mark as attempted
    sessionStorage.setItem(connectKey, 'true');
    console.log('🔌 Auto-connecting wallet:', walletName);
    
    // Add small delay to ensure wallet adapter is ready
    const timer = setTimeout(() => {
      connect()
        .then(() => {
          console.log('✅ Auto-connect successful');
        })
        .catch((err) => {
          console.error('Auto-connect failed:', err);
          sessionStorage.removeItem(connectKey); // Allow retry on error
        });
    }, 100);
    
    return () => clearTimeout(timer);
  }, [mounted, wallet, connected, connecting, connect]);

  // Auto-authenticate when wallet connects (only if no session exists)
  useEffect(() => {
    if (!mounted || !connected || session || isAuthenticating || status === 'loading') return;

    const walletAddress = publicKey?.toString();
    if (!walletAddress || !signMessage) return;

    // Check if we already attempted auth for this wallet in this session
    const authKey = `trogdor_auth_attempted_${walletAddress}`;
    if (sessionStorage.getItem(authKey) === 'true') return;

    // Mark as attempted BEFORE starting
    sessionStorage.setItem(authKey, 'true');
    setIsAuthenticating(true);
    console.log('🔒 Starting authentication for:', walletAddress);
    
    async function authenticate() {
      if (!signMessage) {
        console.error('❌ signMessage function is not available');
        sessionStorage.removeItem(authKey);
        setIsAuthenticating(false);
        return;
      }
      
      try {
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
          publicKey: walletAddress,
          signature: bs58.encode(signature),
          message,
          redirect: false,
        });

        if (result?.error) {
          console.error('❌ Authentication failed:', result.error);
          sessionStorage.removeItem(authKey);
          await disconnect();
        } else {
          console.log('✅ Authentication successful!');
        }
      } catch (error: any) {
        console.error('❌ Authentication error:', error);
        
        // If user cancels, DON'T retry - keep the session storage flag
        if (error?.message === 'User rejected the request.') {
          console.log('⚠️ User cancelled signature - will not retry');
          await disconnect(); // Disconnect so they can try again fresh
        } else {
          // On other errors, allow retry
          sessionStorage.removeItem(authKey);
          await disconnect();
        }
      } finally {
        setIsAuthenticating(false);
      }
    }

    authenticate();
  }, [connected, publicKey, signMessage, session, status, mounted, isAuthenticating, disconnect]);

  // Handle disconnect
  const handleDisconnect = async () => {
    // Clear all attempts from sessionStorage
    if (publicKey) {
      sessionStorage.removeItem(`trogdor_auth_attempted_${publicKey.toString()}`);
    }
    if (wallet) {
      sessionStorage.removeItem(`trogdor_connect_attempted_${wallet.adapter.name}`);
    }
    setIsAuthenticating(false);
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

