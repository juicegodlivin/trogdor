'use client';

import Link from 'next/link';
import { MedievalIcon } from '@/components/ui/MedievalIcon';
import { trpc } from '@/lib/trpc/client';

export function Footer() {
  const { data: stats, isLoading, error } = trpc.stats.getGlobalStats.useQuery();
  
  return (
    <footer className="border-t-2 border-pencil bg-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-hand text-2xl mb-4">About</h3>
            <p className="text-lg text-pencil">
              The Cult of Trogdor the Burninator. Every account is a ledger
              entry. Burninate together.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-hand text-2xl mb-4">Links</h3>
            <ul className="space-y-2 text-lg">
              <li>
                <Link href="/history" className="hover:text-accent-red">
                  History & Lore
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-accent-red">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/generator" className="hover:text-accent-red">
                  Image Generator
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-accent-red">
                  Leaderboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-hand text-2xl mb-4">Community</h3>
            <ul className="space-y-2 text-lg">
              <li>
                <a 
                  href="https://twitter.com/trogdorcult" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent-blue"
                >
                  X Account
                </a>
              </li>
            </ul>
          </div>

          {/* Stats */}
          <div>
            <h3 className="font-hand text-2xl mb-4">
              Stats
              {isLoading && (
                <span className="text-base text-pencil-light ml-2 font-normal">
                  (live)
                </span>
              )}
            </h3>
            <div className="space-y-2 text-lg">
              <div className="flex justify-between items-center">
                <span>Cult Members</span>
                {isLoading ? (
                  <div className="h-5 w-16 bg-sketch animate-pulse rounded" />
                ) : (
                  <span className="font-bold">
                    {error ? '---' : stats?.cultMembers?.toLocaleString() || '0'}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span>Total Offerings</span>
                {isLoading ? (
                  <div className="h-5 w-16 bg-sketch animate-pulse rounded" />
                ) : (
                  <span className="font-bold text-accent-green">
                    {error ? '---' : stats?.totalOfferings?.toLocaleString() || '0'}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span>Images Generated</span>
                {isLoading ? (
                  <div className="h-5 w-16 bg-sketch animate-pulse rounded" />
                ) : (
                  <span className="font-bold">
                    {error ? '---' : stats?.imagesGenerated?.toLocaleString() || '0'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-sketch text-center text-lg text-pencil-light">
          <p>
            Trogdor the Burninator © 2003-2025 The Brothers Chaps. This is a
            fan tribute project.
          </p>
          <div className="mt-2 flex items-center justify-center gap-2">
            <span>Built with</span>
            <MedievalIcon name="torch" size={20} />
            <span>by the cult</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

