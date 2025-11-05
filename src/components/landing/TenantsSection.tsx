import { MedievalIcon } from '@/components/ui/MedievalIcon';
import type { IconName } from '@/components/ui/MedievalIcon';

export function TenantsSection() {
  const tenants: Array<{icon: IconName; title: string; description: string}> = [
    {
      icon: 'torch',
      title: 'Burnination is Life',
      description:
        'Every mention of Trogdor is an offering to the dragon. Create content, post on X,and earn points for your devotion.',
    },
    {
      icon: 'crown',
      title: 'Quality Over Quantity',
      description:
        'High-quality posts earn more offerings. Engagement, creativity, and virality all contribute to your cult standing.',
    },
    {
      icon: 'coins',
      title: 'The Cult Rewards',
      description:
        'Top contributors receive token payouts. Climb the leaderboard and claim your share of the burnination bounty.',
    },
  ];

  return (
    <section className="py-20 px-4 bg-sketch-light">
      <div className="container mx-auto max-w-6xl">
        <h2 className="font-hand text-5xl text-center mb-4">
          Core Burnination Tenants
        </h2>
        <p className="text-center text-pencil mb-12 text-2xl font-semibold">
          The sacred principles that guide all cultists
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tenants.map((tenant) => (
            <div
              key={tenant.title}
              className="border-sketch border-pencil p-8 bg-white hover:shadow-sketch-lg transition-all"
            >
              <div className="flex justify-center mb-4">
                <MedievalIcon name={tenant.icon} size={64} />
              </div>
              <h3 className="font-hand text-3xl mb-4 whitespace-nowrap">{tenant.title}</h3>
              <p className="text-pencil leading-relaxed text-xl font-semibold">{tenant.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

