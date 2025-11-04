'use client';

import Image from 'next/image';
import { MedievalIcon } from '@/components/ui/MedievalIcon';
import { trpc } from '@/lib/trpc/client';

export function HeroSection() {
  const { data: stats, isLoading, error } = trpc.stats.getGlobalStats.useQuery();
  
  return (
    <section className="text-center space-y-8 py-20 px-4 relative">
      {/* Trogdor living on the page - fixed position on desktop, own section on mobile */}
      <div className="lg:absolute lg:left-0 lg:top-1/2 lg:-translate-y-1/2 lg:pointer-events-none lg:z-0 flex justify-center lg:justify-start mb-8 lg:mb-0 lg:w-[300px] xl:w-[400px] 2xl:w-[500px]">
        <Image
          src="/images/trogdor/Trogdor the Burninator.png"
          alt="Trogdor the Burninator"
          width={500}
          height={500}
          className="w-48 sm:w-56 md:w-64 lg:w-full h-auto"
        />
      </div>

      {/* Content wrapper with elevated z-index */}
      <div className="relative z-10">
        {/* Main Headline */}
        <h1 className="font-hand text-6xl md:text-8xl flame-text">
          TROGDOR THE BURNINATOR
        </h1>

        {/* Subheadline */}
        <p className="text-2xl md:text-3xl text-pencil font-hand max-w-3xl mx-auto">
          Join the Cult. Every account is a ledger entry. Burninate together.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
        <button className="btn-sketch text-xl px-8 py-4 bg-accent-green text-white hover:bg-accent-green/90 flex items-center justify-center gap-3">
          <MedievalIcon name="torch" size={28} />
          Sign the Ledger
        </button>
        <button className="btn-sketch text-xl px-8 py-4 hover:bg-sketch flex items-center justify-center gap-3">
          <MedievalIcon name="scroll" size={28} />
          Learn the Lore
        </button>
      </div>

        {/* Stats Preview */}
        <div className="pt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <StatCard
            value={stats?.cultMembers}
            label="Cult Members"
            color="text-accent-green"
            isLoading={isLoading}
            error={error}
          />
          <StatCard
            value={stats?.totalOfferings}
            label="Offerings"
            color="text-accent-red"
            isLoading={isLoading}
            error={error}
          />
          <StatCard
            value={stats?.imagesGenerated}
            label="Burninations"
            color="text-accent-yellow"
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </section>
  );
}

function StatCard({ 
  value, 
  label, 
  color, 
  isLoading, 
  error 
}: { 
  value?: number | string; 
  label: string; 
  color: string; 
  isLoading: boolean; 
  error: any;
}) {
  const displayValue = typeof value === 'number' 
    ? value.toLocaleString() 
    : value || '0';
    
  return (
    <div className="border-sketch border-pencil p-4">
      <div className={`text-4xl font-bold ${color}`}>
        {isLoading ? (
          <div className="h-10 bg-sketch animate-pulse rounded" />
        ) : error ? (
          <span className="text-2xl">---</span>
        ) : (
          displayValue
        )}
      </div>
      <div className="text-sm text-pencil mt-2">
        {label}
        {isLoading && (
          <span className="text-xs text-pencil-light ml-1">(loading...)</span>
        )}
      </div>
    </div>
  );
}

