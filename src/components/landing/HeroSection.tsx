'use client';

import Image from 'next/image';
import { MedievalIcon } from '@/components/ui/MedievalIcon';
import { trpc } from '@/lib/trpc/client';

export function HeroSection() {
  const { data: stats } = trpc.stats.getGlobalStats.useQuery();
  return (
    <section className="text-center space-y-8 py-20 px-4">
      {/* Logo/Icon */}
      <div className="flex justify-center">
        <div className="w-48 h-48 border-sketch border-pencil p-4 notebook-paper">
          <Image
            src="/images/trogdor/Trogdor the Burninator.png"
            alt="Trogdor the Burninator"
            width={192}
            height={192}
            className="w-full h-full object-contain"
          />
        </div>
      </div>

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
        <div className="border-sketch border-pencil p-4">
          <div className="text-4xl font-bold text-accent-green">
            {stats?.cultMembers?.toLocaleString() || '0'}
          </div>
          <div className="text-sm text-pencil mt-2">Cult Members</div>
        </div>
        <div className="border-sketch border-pencil p-4">
          <div className="text-4xl font-bold text-accent-red">
            {stats?.totalOfferings?.toLocaleString() || '0'}
          </div>
          <div className="text-sm text-pencil mt-2">Offerings</div>
        </div>
        <div className="border-sketch border-pencil p-4">
          <div className="text-4xl font-bold text-accent-yellow">
            {stats?.imagesGenerated?.toLocaleString() || '0'}
          </div>
          <div className="text-sm text-pencil mt-2">Burninations</div>
        </div>
      </div>
    </section>
  );
}

