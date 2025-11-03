'use client';

import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import { WalletConnectButton } from '@/components/wallet/WalletConnectButton';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-pencil shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 border-sketch border-pencil p-1 bg-accent-green/20">
              <Image
                src="/images/trogdor/Trogdor the Burninator.png"
                alt="Trogdor"
                width={48}
                height={48}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-hand text-2xl hidden md:block">
              Trogdor the Burninator
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/history">History</NavLink>
            <NavLink href="/products">Products</NavLink>
            <NavLink href="/generator">Generator</NavLink>
            <NavLink href="/leaderboard">Leaderboard</NavLink>
          </nav>

          {/* Wallet Button */}
          <div className="hidden md:block">
            <WalletConnectButton />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t-2 border-sketch">
            <nav className="flex flex-col gap-4">
              <NavLink href="/" onClick={() => setIsMenuOpen(false)}>
                Home
              </NavLink>
              <NavLink href="/history" onClick={() => setIsMenuOpen(false)}>
                History
              </NavLink>
              <NavLink href="/products" onClick={() => setIsMenuOpen(false)}>
                Products
              </NavLink>
              <NavLink href="/generator" onClick={() => setIsMenuOpen(false)}>
                Generator
              </NavLink>
              <NavLink href="/leaderboard" onClick={() => setIsMenuOpen(false)}>
                Leaderboard
              </NavLink>
              <div className="mt-2">
                <WalletConnectButton />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

function NavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="font-hand text-lg text-pencil hover:text-accent-red transition-colors"
    >
      {children}
    </Link>
  );
}

