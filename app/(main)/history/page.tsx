import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MedievalIcon } from '@/components/ui/MedievalIcon';
import Image from 'next/image';

export default function HistoryPage() {
  return (
    <div className="min-h-screen notebook-paper">
      <Header />
      <main className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <MedievalIcon name="scroll" size={80} />
            <h1 className="font-hand text-6xl md:text-8xl flame-text mb-8">
              The Legend of Trogdor
            </h1>
          </div>
          <p className="text-3xl md:text-4xl text-pencil max-w-3xl mx-auto font-bold">
            From a simple email on January 13, 2003, Trogdor emerged from Strong Bad&apos;s 
            imagination to burninate the countryside and capture hearts worldwide.
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto space-y-16">
          {/* The Beginning */}
          <TimelineSection
            year="2003"
            date="January 13"
            title="The Birth of Trogdor"
            imagePosition="left"
            icon="castle"
          >
            <p className="mb-4">
              In <strong>Strong Bad Email #58</strong>, a fan asks Strong Bad to draw a dragon. 
              What follows is a masterclass in improvisational character design:
            </p>
            <ol className="space-y-2 list-decimal list-inside">
              <li className="text-pencil">First, draw an &apos;S&apos; for Snake... or Dragon...</li>
              <li className="text-pencil">Then a more different &apos;S&apos;</li>
              <li className="text-pencil">Consummate V&apos;s for teeth</li>
              <li className="text-pencil">Add spinities along the back</li>
              <li className="text-pencil">Give him a beefy arm for good measure</li>
            </ol>
            <div className="mt-6 p-4 bg-yellow-50 border-sketch">
              <p className="font-hand text-2xl italic">
                &quot;TROGDOR WAS A MAN! I mean, he was a dragon-man! 
                Or maybe he was just a dragon... But he was still TROGDOR!&quot;
              </p>
            </div>
          </TimelineSection>

          {/* The Song */}
          <TimelineSection
            year="2003"
            date="March"
            title="Trogdor Theme Song"
            imagePosition="right"
            icon="trumpet"
          >
            <p className="mb-4">
              The Brothers Chaps released the full <strong>Trogdor Theme Song</strong>, 
              turning a simple joke into internet folklore. The song details Trogdor&apos;s 
              legendary exploits:
            </p>
            <div className="space-y-3 text-lg">
              <div className="flex items-start gap-3">
                <MedievalIcon name="torch" size={32} />
                <span>Burninating the countryside</span>
              </div>
              <div className="flex items-start gap-3">
                <MedievalIcon name="torch" size={32} />
                <span>Burninating the peasants</span>
              </div>
              <div className="flex items-start gap-3">
                <MedievalIcon name="torch" size={32} />
                <span>Burninating all the peoples</span>
              </div>
              <div className="flex items-start gap-3">
                <MedievalIcon name="torch" size={32} />
                <span>And their thatched-roof cottages!</span>
              </div>
            </div>
          </TimelineSection>

          {/* Cultural Impact */}
          <TimelineSection
            year="2004-2010"
            title="Cultural Phenomenon"
            imagePosition="left"
            icon="crown"
          >
            <p className="mb-4">
              Trogdor transcended internet humor to become a genuine cultural touchstone:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-accent-green mr-3 text-xl">→</span>
                <span>
                  <strong>Guitar Hero II</strong> featured &quot;Trogdor&quot; as an unlockable bonus track
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-accent-green mr-3 text-xl">→</span>
                <span>
                  Appeared in <strong>multiple video games</strong> including &quot;Peasant&apos;s Quest&quot;
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-accent-green mr-3 text-xl">→</span>
                <span>
                  Referenced in TV shows like <strong>Buffy the Vampire Slayer</strong>
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-accent-green mr-3 text-xl">→</span>
                <span>
                  Became a <strong>staple of meme culture</strong> before memes had a name
                </span>
              </li>
            </ul>
          </TimelineSection>

          {/* The Board Game */}
          <TimelineSection
            year="2019"
            title="Trogdor!! The Board Game"
            imagePosition="right"
            icon="target"
          >
            <p className="mb-4">
              The Brothers Chaps launched a Kickstarter for <strong>Trogdor!! The Board Game</strong>, 
              a cooperative adventure game where players work together to burninate the countryside 
              before the Kerrek and knights arrive.
            </p>
            <div className="p-4 border-2 border-dashed border-pencil-light">
              <p className="font-bold mb-2">Campaign Results:</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="border-sketch border-pencil p-3">
                  <div className="text-3xl font-bold text-accent-green">$1.4M+</div>
                  <div className="text-sm text-pencil">Total Raised</div>
                </div>
                <div className="border-sketch border-pencil p-3">
                  <div className="text-3xl font-bold text-accent-red">21,000+</div>
                  <div className="text-sm text-pencil">Backers</div>
                </div>
              </div>
            </div>
          </TimelineSection>

          {/* Web3 Era */}
          <TimelineSection
            year="2024-2025"
            title="Trogdor Enters Web3"
            imagePosition="left"
            icon="bridge"
          >
            <p className="mb-4">
              The cult of Trogdor finds new life on the Solana blockchain, where every 
              account becomes a ledger entry in the great burnination.
            </p>
            <div className="space-y-4">
              <div className="p-4 border-sketch">
                <div className="flex items-center gap-2 mb-2">
                  <MedievalIcon name="torch" size={28} />
                  <h4 className="font-hand text-xl">The Tenets</h4>
                </div>
                <ul className="space-y-2">
                  <li className="text-pencil">
                    <strong>Burnination is Eternal:</strong> Every transaction, every mention, 
                    every meme immortalized on-chain
                  </li>
                  <li className="text-pencil">
                    <strong>The Cult Grows:</strong> Community-driven, merit-based leaderboards 
                    reward true believers
                  </li>
                  <li className="text-pencil">
                    <strong>AI Summoning:</strong> Generate your own Trogdor visions using 
                    the ancient powers of artificial intelligence
                  </li>
                </ul>
              </div>
            </div>
          </TimelineSection>

          {/* Join the Cult */}
          <div className="text-center py-16 border-sketch border-pencil notebook-paper">
            <div className="flex items-center justify-center gap-4 mb-6">
              <MedievalIcon name="torch" size={64} />
              <h2 className="font-hand text-5xl">Join the Burnination</h2>
            </div>
            <p className="text-3xl text-pencil mb-8 max-w-2xl mx-auto font-bold">
              The legend continues with you. Connect your wallet, generate art, 
              and prove your devotion to Trogdor the Burninator.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/generator"
                className="btn-sketch text-xl px-8 py-4 bg-accent-red text-white hover:bg-accent-red/90 inline-flex items-center gap-3"
              >
                <MedievalIcon name="torch" size={28} />
                Generate Art
              </a>
              <a
                href="/leaderboard"
                className="btn-sketch text-xl px-8 py-4 hover:bg-sketch inline-flex items-center gap-3"
              >
                <MedievalIcon name="crown" size={28} />
                View Leaderboard
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

interface TimelineSectionProps {
  year: string;
  date?: string;
  title: string;
  imagePosition: 'left' | 'right';
  icon: 'castle' | 'trumpet' | 'crown' | 'target' | 'bridge';
  children: React.ReactNode;
}

function TimelineSection({
  year,
  date,
  title,
  imagePosition,
  icon,
  children,
}: TimelineSectionProps) {
  return (
    <section className="scroll-mt-20">
      <div
        className={`flex flex-col ${
          imagePosition === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'
        } gap-8 items-start`}
      >
        {/* Image/Icon Side */}
        <div className="md:w-1/3">
          <div className="notebook-paper p-6 border-sketch sticky top-24">
            <div className="flex justify-center mb-4">
              <MedievalIcon name={icon} size={96} />
            </div>
            <div className="text-center">
              <div className="text-sm text-pencil-light uppercase tracking-wide">
                {date ? `${year} - ${date}` : year}
              </div>
            </div>
          </div>
        </div>

        {/* Content Side */}
        <div className="md:w-2/3">
          <div className="border-2 border-dashed border-pencil p-6">
            <h2 className="font-hand text-4xl mb-4">{title}</h2>
            <div className="text-lg leading-relaxed space-y-4">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

