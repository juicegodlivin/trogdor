'use client';

import Link from 'next/link';
import { trpc } from '@/lib/trpc/client';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { MedievalIcon } from '@/components/ui/MedievalIcon';

export function LeaderboardPreview() {
  const { data: topTen, isLoading, error } = trpc.leaderboard.getTopTen.useQuery();

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-hand text-5xl">Top Cultists</h2>
          <Link href="/leaderboard" className="btn-sketch">
            View Full Leaderboard →
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="border-sketch border-pencil bg-red-50 p-8 text-center">
            <p className="text-pencil">Failed to load leaderboard</p>
          </div>
        ) : topTen && topTen.length > 0 ? (
          <div className="border-sketch border-pencil bg-white">
            <table className="w-full">
              <thead className="bg-sketch border-b-2 border-pencil">
                <tr>
                  <th className="p-4 text-left font-hand text-xl">Rank</th>
                  <th className="p-4 text-left font-hand text-xl">Cultist</th>
                  <th className="p-4 text-right font-hand text-xl">
                    Offerings
                  </th>
                </tr>
              </thead>
              <tbody>
                {topTen.slice(0, 5).map((user, idx) => (
                  <tr
                    key={user.id}
                    className="border-b border-sketch hover:bg-sketch-light"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {idx < 3 && (
                          <MedievalIcon 
                            name={idx === 0 ? 'crown' : idx === 1 ? 'shield' : 'gem'} 
                            size={24} 
                          />
                        )}
                        <span className="text-lg font-bold">#{idx + 1}</span>
                      </div>
                    </td>
                    <td className="p-4 font-hand text-lg">
                      {user.username || `${user.walletAddress.slice(0, 6)}...`}
                    </td>
                    <td className="p-4 text-right text-2xl font-bold text-accent-green">
                      {user.totalOfferings.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="border-sketch border-pencil bg-white p-12 text-center">
            <div className="flex justify-center mb-4">
              <MedievalIcon name="throne" size={64} />
            </div>
            <p className="font-hand text-2xl text-pencil-light mb-2">
              No cultists yet!
            </p>
            <p className="text-pencil">
              Be the first to join the leaderboard
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

