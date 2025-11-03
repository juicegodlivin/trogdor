import type { Metadata } from 'next';
import { inter, caveat, jetbrainsMono } from '@/config/fonts';
import { TRPCProvider } from '@/lib/trpc/Provider';
import { WalletProvider } from '@/components/providers/WalletProvider';
import { SessionProvider } from '@/components/providers/SessionProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Trogdor the Burninator - The Cult',
  description: 'Join the Cult of Trogdor. Every account is a ledger entry. Burninate together.',
  keywords: ['Trogdor', 'Burninator', 'Strong Bad', 'Homestar Runner', 'Solana', 'Web3', 'Meme'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${caveat.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-white" suppressHydrationWarning>
        <SessionProvider>
          <WalletProvider>
            <TRPCProvider>{children}</TRPCProvider>
          </WalletProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

