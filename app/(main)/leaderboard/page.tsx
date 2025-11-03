'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MedievalIcon } from '@/components/ui/MedievalIcon';
import { useState } from 'react';
import { trpc } from '@/lib/trpc/client';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

type Period = 'alltime' | 'monthly' | 'weekly' | 'daily';

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<Period>('alltime');
  const [page, setPage] = useState(1);

  const { data: leaderboard, isLoading } =
    trpc.leaderboard.getLeaderboard.useQuery({
      period,
      page,
      limit: 50,
    });

  return (
    <div className="min-h-screen notebook-paper">
      <Header />
      <main className="container mx-auto px-4 py-12">
        {/* Rules Section */}
        <div className="mb-12 border-sketch border-pencil bg-sketch-light p-8">
          <h2 className="font-hand text-4xl mb-6">How Offerings Work</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-hand text-2xl mb-4">Point System</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="text-accent-green font-bold mr-3 text-lg">
                    1-100
                  </span>
                  <span>Points per mention based on engagement quality</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent-green font-bold mr-3 text-lg">
                    +10
                  </span>
                  <span>Bonus for including images or videos</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent-green font-bold mr-3 text-lg">
                    +20
                  </span>
                  <span>Bonus for viral posts (10k+ impressions)</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-hand text-2xl mb-4">Quality Factors</h3>
              <ul className="space-y-2 text-sm">
                <li>✓ Likes & retweets</li>
                <li>✓ Original content</li>
                <li>✓ Trogdor imagery</li>
                <li>✓ Community engagement</li>
                <li>✗ Spam or low-effort posts</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 p-6 bg-accent-yellow/20 border-2 border-dashed border-accent-yellow flex items-center gap-3">
            <MedievalIcon name="torch" size={32} />
            <p className="font-hand text-xl">
              Weekly Rewards: Top 10 contributors receive token payouts!
            </p>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex justify-center gap-3 mb-8 flex-wrap">
          {(['alltime', 'monthly', 'weekly', 'daily'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => {
                setPeriod(p);
                setPage(1);
              }}
              className={`px-6 py-3 font-hand text-xl capitalize ${
                period === p
                  ? 'border-sketch border-pencil bg-accent-green text-white'
                  : 'border-sketch border-pencil hover:bg-sketch'
              }`}
            >
              {p === 'alltime' ? 'All Time' : p}
            </button>
          ))}
        </div>

        {/* Leaderboard Table */}
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="border-sketch border-pencil bg-white overflow-hidden">
            <table className="w-full">
              <thead className="bg-sketch border-b-2 border-pencil">
                <tr>
                  <th className="p-4 text-left font-hand text-xl">Rank</th>
                  <th className="p-4 text-left font-hand text-xl">Cultist</th>
                  <th className="p-4 text-right font-hand text-xl">
                    Offerings
                  </th>
                  <th className="p-4 text-center font-hand text-xl">Status</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard && leaderboard.length > 0 ? (
                  leaderboard.map((user, idx) => {
                    const rank = (page - 1) * 50 + idx + 1;
                    return (
                      <tr
                        key={user.id}
                        className={`border-b border-sketch hover:bg-sketch-light transition-colors ${
                          rank <= 3 ? 'bg-accent-yellow/10' : ''
                        }`}
                      >
                        {/* Rank */}
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {rank <= 3 && (
                              <MedievalIcon 
                                name={rank === 1 ? 'crown' : rank === 2 ? 'shield' : 'gem'} 
                                size={24} 
                              />
                            )}
                            <span className="text-lg font-bold">#{rank}</span>
                          </div>
                        </td>

                        {/* User */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 border-sketch border-pencil rounded-full overflow-hidden bg-accent-green/20 flex items-center justify-center">
                              {user.profileImage ? (
                                <img
                                  src={user.profileImage}
                                  alt={user.username || 'User'}
                                />
                              ) : (
                                <MedievalIcon name="knight" size={24} />
                              )}
                            </div>
                            <div>
                              <div className="font-hand text-lg">
                                {user.username ||
                                  `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}`}
                              </div>
                              {user.twitterHandle && (
                                <a
                                  href={`https://twitter.com/${user.twitterHandle}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-accent-blue hover:underline"
                                >
                                  @{user.twitterHandle}
                                </a>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Offerings */}
                        <td className="p-4 text-right">
                          <div className="text-2xl font-bold text-accent-green">
                            {user.totalOfferings.toLocaleString()}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="p-4 text-center">
                          {user.isVerified && (
                            <MedievalIcon name="flag" size={20} title="Verified Cultist" />
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-pencil-light">
                      <div className="flex justify-center mb-4">
                        <MedievalIcon name="throne" size={64} />
                      </div>
                      <p className="font-hand text-2xl">
                        No cultists yet. Be the first to join!
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {leaderboard && leaderboard.length === 50 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="btn-sketch disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <span className="font-hand text-xl">Page {page}</span>
            <button
              onClick={() => setPage(page + 1)}
              className="btn-sketch"
            >
              Next →
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

