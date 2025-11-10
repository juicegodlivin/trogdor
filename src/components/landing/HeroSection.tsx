'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MedievalIcon } from '@/components/ui/MedievalIcon';
import { ContractAddressWidget } from '@/components/ui/ContractAddressWidget';
import { trpc } from '@/lib/trpc/client';

export function HeroSection() {
  const { data: stats, isLoading, error } = trpc.stats.getGlobalStats.useQuery();
  
  return (
    <section className="text-center space-y-8 py-20 px-4 relative">
      {/* Mobile: CA Widget above images */}
      <div className="flex justify-center mb-6 lg:hidden">
        <ContractAddressWidget variant="hero" />
      </div>

      {/* Mobile: Side-by-side layout - aligned at bottom */}
      <div className="flex justify-center items-end gap-4 mb-8 lg:hidden">
        <div className="w-[230px] sm:w-72">
          <Image
            src="/images/trogdor/Trogdor the Burninator.png"
            alt="Trogdor the Burninator"
            width={625}
            height={625}
            className="w-full h-auto"
          />
        </div>
        <div className="w-32 sm:w-40">
          <Image
            src="/images/trogdor/Peasant Burninating.png"
            alt="Peasant being burninated"
            width={500}
            height={500}
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* Desktop: Trogdor on left - 25% larger, lowered to align with peasant */}
      <div className="hidden lg:block lg:absolute lg:left-0 lg:top-[55%] lg:-translate-y-1/2 lg:pointer-events-none lg:z-0 lg:w-[375px] xl:w-[500px] 2xl:w-[625px]">
        <Image
          src="/images/trogdor/Trogdor the Burninator.png"
          alt="Trogdor the Burninator"
          width={625}
          height={625}
          className="w-full h-auto"
        />
      </div>

      {/* Desktop: Burning Peasant on right - same horizontal level */}
      <div className="hidden lg:block lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 lg:pointer-events-none lg:z-0 lg:w-[300px] xl:w-[400px] 2xl:w-[500px]">
        <Image
          src="/images/trogdor/Peasant Burninating.png"
          alt="Peasant being burninated"
          width={500}
          height={500}
          className="w-full h-auto"
        />
      </div>

      {/* Content wrapper with elevated z-index */}
      <div className="relative z-10">
        {/* Main Headline */}
        <h1 className="font-hand text-6xl md:text-8xl flame-text mb-8">
          TROGDOR THE BURNINATOR
        </h1>

        {/* Subheadline */}
        <p className="text-3xl md:text-4xl text-pencil font-bold max-w-3xl mx-auto">
          Join the Cult. Every account is a ledger entry. Burninate together.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link href="/dashboard" className="btn-sketch text-xl px-8 py-4 bg-accent-green text-white hover:bg-accent-green/90 flex items-center justify-center gap-3">
            <MedievalIcon name="torch" size={28} />
            Sign the Ledger
          </Link>
          <Link href="/history" className="btn-sketch text-xl px-8 py-4 hover:bg-sketch flex items-center justify-center gap-3">
            <MedievalIcon name="scroll" size={28} />
            Learn the Lore
          </Link>
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

