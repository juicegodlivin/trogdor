'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useSession } from 'next-auth/react';
import { trpc } from '@/lib/trpc/client';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { MedievalIcon } from '@/components/ui/MedievalIcon';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // All useState hooks must be at the top, before any conditional returns
  const [twitterInput, setTwitterInput] = useState('');
  const [isLinking, setIsLinking] = useState(false);
  const [linkError, setLinkError] = useState('');

  // Fetch user profile data
  const { data: profile, isLoading: profileLoading, refetch: refetchProfile } = trpc.user.getProfile.useQuery(
    undefined,
    { enabled: !!session }
  );

  // Fetch user's generated images
  const { data: images, isLoading: imagesLoading } = trpc.generator.getHistory.useQuery(
    { limit: 6, offset: 0 },
    { enabled: !!session }
  );

  // Link Twitter mutation - MUST be before conditional returns
  const linkTwitterMutation = trpc.user.linkTwitter.useMutation({
    onSuccess: () => {
      setIsLinking(false);
      setTwitterInput('');
      setLinkError('');
      // Refetch profile to show updated username
      refetchProfile();
    },
    onError: (error) => {
      setLinkError(error.message);
      setIsLinking(false);
    },
  });

  // Unlink Twitter mutation
  const unlinkTwitterMutation = trpc.user.unlinkTwitter.useMutation({
    onSuccess: () => {
      setLinkError('');
      // Refetch profile to show unlinked state
      refetchProfile();
    },
    onError: (error) => {
      setLinkError(error.message);
    },
  });

  // Redirect to home if not authenticated
  if (status === 'loading') {
    return (
      <div className="min-h-screen notebook-paper flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!session) {
    router.push('/');
    return null;
  }

  const handleLinkTwitter = () => {
    if (!twitterInput.trim()) {
      setLinkError('Please enter your Twitter username');
      return;
    }

    setIsLinking(true);
    setLinkError('');
    linkTwitterMutation.mutate({ twitterUsername: twitterInput.trim() });
  };

  const isTwitterLinked = !!profile?.twitterUsername;

  return (
    <div className="min-h-screen notebook-paper">
      <Header />
      <main className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="mb-12 flex items-center gap-4">
          <MedievalIcon name="torch" size={64} />
          <div>
            <h1 className="font-hand text-6xl flame-text mb-2">
              Your Dashboard
            </h1>
            <p className="text-xl text-pencil">
              Manage your profile, link your X account, and track your burninations.
            </p>
          </div>
        </div>

        {/* Profile Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="border-sketch border-pencil p-6 notebook-paper">
              <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 border-sketch bg-accent-green/20">
                <Image
                  src="/images/trogdor/Trogdor the Burninator.png"
                  alt="Trogdor"
                  width={96}
                  height={96}
                  className="object-contain"
                />
              </div>
              <h2 className="font-hand text-2xl text-center mb-4">
                {profile?.username || 'Cult Member'}
              </h2>
              
              {/* Wallet Address */}
              <div className="mb-6">
                <label className="text-sm text-pencil-light mb-2 block">
                  Wallet Address
                </label>
                <div className="font-mono text-xs p-3 bg-yellow-50 border border-pencil rounded break-all">
                  {session.user.walletAddress}
                </div>
              </div>

              {/* Twitter Connection */}
              <div className="mb-6">
                <label className="text-sm text-pencil-light mb-2 block">
                  X (Twitter) Account
                </label>
                {isTwitterLinked ? (
                  <div>
                    <div className="flex items-center gap-2 p-3 bg-accent-green/20 border-sketch">
                      <MedievalIcon name="flag" size={24} />
                      <div className="flex-1">
                        <div className="font-medium">
                          @{profile.twitterUsername}
                        </div>
                        <div className="text-xs text-pencil-light">Linked</div>
                      </div>
              <button
                onClick={() => unlinkTwitterMutation.mutate()}
                disabled={unlinkTwitterMutation.isPending}
                className="btn-sketch px-3 py-1 text-xs bg-accent-red text-white hover:bg-accent-red/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {unlinkTwitterMutation.isPending ? 'Unlinking...' : 'Unlink'}
              </button>
                    </div>
                    {linkError && (
                      <div className="mt-2 text-xs text-accent-red">
                        {linkError}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={twitterInput}
                        onChange={(e) => setTwitterInput(e.target.value)}
                        placeholder="@yourusername"
                        className="flex-1 px-3 py-2 border-2 border-pencil font-mono text-sm focus:outline-none focus:border-accent-blue"
                        disabled={isLinking}
                      />
                      <button
                        onClick={handleLinkTwitter}
                        disabled={isLinking || !twitterInput.trim()}
                        className="btn-sketch px-4 py-2 bg-accent-blue text-white hover:bg-accent-blue/90 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLinking ? '...' : 'Link'}
                      </button>
                    </div>
                    {linkError && (
                      <div className="mt-2 text-xs text-accent-red">
                        {linkError}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {isTwitterLinked && (
                <div className="text-sm text-pencil bg-yellow-50 p-3 border border-pencil flex gap-2">
                  <MedievalIcon name="torch" size={20} />
                  <div>
                    <strong>Pro Tip:</strong> Tweet your generated art with{' '}
                    <code className="font-mono bg-white px-1">@TrogdorOnSol</code> to earn
                    leaderboard points!
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Total Mentions */}
              <StatCard
                icon="quill"
                label="Total Mentions"
                value={profile?.totalMentions || 0}
                color="accent-blue"
                loading={profileLoading}
              />

              {/* Quality Score */}
              <StatCard
                icon="gem"
                label="Average Score"
                value={profile?.averageScore ? Math.round(profile.averageScore) : 0}
                color="accent-yellow"
                loading={profileLoading}
                suffix="/100"
              />

              {/* Images Generated */}
              <StatCard
                icon="scroll"
                label="Images Generated"
                value={profile?.totalImages || 0}
                color="accent-purple"
                loading={profileLoading}
              />

              {/* Leaderboard Rank */}
              <StatCard
                icon="crown"
                label="Leaderboard Rank"
                value={profile?.rank || '—'}
                color="accent-red"
                loading={profileLoading}
                prefix="#"
              />
            </div>

            {/* Recent Activity */}
            <div className="mt-6 border-sketch border-pencil p-6 notebook-paper">
              <div className="flex items-center gap-3 mb-4">
                <MedievalIcon name="scroll" size={32} />
                <h3 className="font-hand text-2xl">Recent Activity</h3>
              </div>
              
              {profile?.recentMentions && profile.recentMentions.length > 0 ? (
                <div className="space-y-3">
                  {profile.recentMentions.slice(0, 3).map((mention: any) => (
                    <div
                      key={mention.id}
                      className="flex items-start gap-3 p-3 border border-pencil-light"
                    >
                      <MedievalIcon name="torch" size={32} />
                      <div className="flex-1">
                        <p className="text-sm line-clamp-2">{mention.content}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-pencil-light">
                          <span>Score: {mention.qualityScore}/100</span>
                          <span>•</span>
                          <span>{new Date(mention.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-pencil-light">
                  <p className="mb-2">No mentions yet!</p>
                  <p className="text-sm">
                    {isTwitterLinked
                      ? 'Tweet about Trogdor and tag @TrogdorOnSol to get started.'
                      : 'Link your X account to start tracking mentions.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Generated Images Gallery */}
        <div className="border-sketch border-pencil p-6 notebook-paper">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <MedievalIcon name="scroll" size={40} />
              <h2 className="font-hand text-3xl">Your Generated Art</h2>
            </div>
            <a
              href="/generator"
              className="btn-sketch px-4 py-2 text-sm hover:bg-sketch"
            >
              + Generate More
            </a>
          </div>

          {imagesLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : images && images.images.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.images.map((image: any) => (
                  <div
                    key={image.id}
                    className="border-sketch border-pencil overflow-hidden group"
                  >
                    <div className="relative aspect-square">
                      <Image
                        src={image.imageUrl}
                        alt={image.prompt}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-3 bg-white">
                      <p className="text-sm line-clamp-2 mb-2">{image.prompt}</p>
                      <div className="text-xs text-pencil-light">
                        {new Date(image.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {images.hasMore && (
                <div className="text-center mt-6">
                  <button className="btn-sketch px-6 py-2 hover:bg-sketch">
                    Load More
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-pencil-light">
              <div className="flex justify-center mb-4">
                <MedievalIcon name="scroll" size={80} />
              </div>
              <h3 className="font-hand text-2xl mb-2">No art generated yet!</h3>
              <p className="text-pencil mb-4">
                Summon Trogdor with the power of AI
              </p>
              <a
                href="/generator"
                className="btn-sketch px-6 py-3 bg-accent-red text-white hover:bg-accent-red/90 inline-flex items-center gap-2"
              >
                <MedievalIcon name="torch" size={24} />
                Create Your First Burnination
              </a>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

interface StatCardProps {
  icon: 'quill' | 'gem' | 'scroll' | 'crown';
  label: string;
  value: number | string;
  color: string;
  loading?: boolean;
  prefix?: string;
  suffix?: string;
}

function StatCard({
  icon,
  label,
  value,
  color,
  loading,
  prefix = '',
  suffix = '',
}: StatCardProps) {
  return (
    <div className="border-sketch border-pencil p-6 notebook-paper text-center">
      <div className="flex justify-center mb-2">
        <MedievalIcon name={icon} size={48} />
      </div>
      <div className="text-sm text-pencil-light mb-2">{label}</div>
      {loading ? (
        <div className="h-10 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div className={`text-3xl font-bold text-${color}`}>
          {prefix}
          {value}
          {suffix}
        </div>
      )}
    </div>
  );
}

