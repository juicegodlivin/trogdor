import type { Metadata } from 'next';
import { inter, caveat, jetbrainsMono } from '@/config/fonts';
import { TRPCProvider } from '@/lib/trpc/Provider';
import { WalletProvider } from '@/components/providers/WalletProvider';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Trogdor the Burninator - The Cult',
  description: 'Join the Cult of Trogdor. Every account is a ledger entry. Burninate together with Web3, AI art generation, and community rewards.',
  keywords: ['Trogdor', 'Burninator', 'Strong Bad', 'Homestar Runner', 'Solana', 'Web3', 'Meme', 'Cult', 'NFT', 'AI Art'],
  icons: {
    icon: '/images/trogdor/Trogdor Favicon.png',
    apple: '/images/trogdor/Trogdor Favicon.png',
  },
  openGraph: {
    title: 'Trogdor the Burninator - The Cult',
    description: 'Join the Cult of Trogdor the Burninator on Solana',
    images: ['/images/trogdor/Trogdor the Burninator.png'],
    url: 'https://trogdor.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trogdor the Burninator',
    description: 'Burninate the countryside on Solana',
    images: ['/images/trogdor/Trogdor the Burninator.png'],
    site: '@trogdorcult',
    creator: '@trogdorcult',
  },
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
            <TRPCProvider>
              {children}
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#fff',
                    color: '#2d2d2d',
                    border: '2px solid #2d2d2d',
                    borderRadius: '4px',
                    fontFamily: 'var(--font-jetbrains-mono)',
                  },
                  success: {
                    iconTheme: {
                      primary: '#10b981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
              <Analytics />
              <SpeedInsights />
            </TRPCProvider>
          </WalletProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

