import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MedievalIcon } from '@/components/ui/MedievalIcon';
import type { IconName } from '@/components/ui/MedievalIcon';

export default function ProductsPage() {
  return (
    <div className="min-h-screen notebook-paper">
      <Header />
      <main className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <MedievalIcon name="cart" size={80} />
            <h1 className="font-hand text-6xl md:text-8xl flame-text mb-8">
              Trogdor Merchandise
            </h1>
          </div>
          <p className="text-3xl md:text-4xl text-pencil max-w-3xl mx-auto font-bold">
            Show your allegiance to the Burninator with official merch from the Brothers Chaps. 
            Every purchase fuels the eternal flame of Trogdor.
          </p>
        </div>

        {/* Official Store Link */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="border-sketch border-pencil p-8 notebook-paper text-center">
            <div className="flex justify-center mb-4">
              <MedievalIcon name="stall" size={80} />
            </div>
            <h2 className="font-hand text-4xl mb-4">Official Homestar Runner Store</h2>
            <p className="text-2xl text-pencil mb-6 font-semibold">
              All official Trogdor merchandise is available through the Homestar Runner Store. 
              Support the creators and get authentic burnination gear!
            </p>
            <a
              href="https://homestarrunner.com/store"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-sketch text-xl px-8 py-4 bg-accent-green text-white hover:bg-accent-green/90 inline-flex items-center gap-3"
            >
              <MedievalIcon name="bridge" size={28} />
              Visit Official Store
            </a>
          </div>
        </div>

        {/* Product Showcase */}
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-12">
            <MedievalIcon name="torch" size={48} />
            <h2 className="font-hand text-5xl text-center">
              Featured Burninations
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProductCard
              icon="chainmail"
              title="T-Shirts"
              description="Classic Trogdor designs on premium tees. Burninate in style."
              color="accent-red"
            />
            <ProductCard
              icon="target"
              title="Board Game"
              description="Trogdor!! The Board Game - A cooperative adventure of medieval burnination."
              color="accent-green"
            />
            <ProductCard
              icon="castle"
              title="Video Games"
              description="Peasant's Quest and other Trogdor-themed digital adventures."
              color="accent-yellow"
            />
            <ProductCard
              icon="spellbook"
              title="Comics & Books"
              description="The illustrated chronicles of Trogdor's legendary escapades."
              color="accent-blue"
            />
            <ProductCard
              icon="treasure"
              title="Collectibles"
              description="Pins, stickers, patches, and more for the discerning burninator."
              color="accent-purple"
            />
            <ProductCard
              icon="trumpet"
              title="Music"
              description="The Trogdor Theme Song and other Strong Bad musical masterpieces."
              color="accent-red"
            />
          </div>
        </div>

        {/* Community Creations */}
        <div className="max-w-4xl mx-auto mt-24">
          <div className="border-2 border-dashed border-pencil p-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <MedievalIcon name="scroll" size={40} />
              <h2 className="font-hand text-4xl text-center">
                Community Creations
              </h2>
            </div>
            <p className="text-2xl text-pencil mb-6 font-semibold">
              Want to see your Trogdor art featured? Generate art using our AI tool, 
              tweet it with <code className="bg-yellow-50 px-2 py-1 font-mono">@trogdorcult</code>, 
              and climb the leaderboard!
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-sketch border-pencil p-6 notebook-paper">
                <div className="flex items-center gap-2 mb-3">
                  <MedievalIcon name="torch" size={28} />
                  <h3 className="font-hand text-2xl">For Creators</h3>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-accent-red mr-2">→</span>
                    <span>Use our AI generator to create unique Trogdor art</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent-red mr-2">→</span>
                    <span>Share on Twitter for leaderboard points</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent-red mr-2">→</span>
                    <span>Build your reputation in the cult</span>
                  </li>
                </ul>
                <a
                  href="/generator"
                  className="mt-4 btn-sketch px-6 py-3 bg-accent-red text-white hover:bg-accent-red/90 inline-flex items-center justify-center gap-2 w-full"
                >
                  Start Creating →
                </a>
              </div>

              <div className="border-sketch border-pencil p-6 notebook-paper">
                <div className="flex items-center gap-2 mb-3">
                  <MedievalIcon name="crown" size={28} />
                  <h3 className="font-hand text-2xl">Top Burninators</h3>
                </div>
                <p className="text-pencil mb-4">
                  Check out the Hall of Fame to see the most legendary contributors 
                  to Trogdor lore.
                </p>
                <a
                  href="/leaderboard"
                  className="mt-4 btn-sketch px-6 py-3 hover:bg-sketch inline-flex items-center justify-center gap-2 w-full"
                >
                  View Leaderboard →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Notice */}
        <div className="max-w-4xl mx-auto mt-16 p-6 bg-yellow-50 border-sketch">
          <p className="text-sm text-pencil text-center">
            <strong>Note:</strong> This project is a fan tribute. All Trogdor and Homestar Runner 
            characters and content are © The Brothers Chaps. Support the official releases!
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

interface ProductCardProps {
  icon: IconName;
  title: string;
  description: string;
  color: string;
}

function ProductCard({ icon, title, description, color }: ProductCardProps) {
  return (
    <div className="border-sketch border-pencil p-6 notebook-paper hover:shadow-sketch transition-shadow">
      <div className="flex justify-center mb-4">
        <MedievalIcon name={icon} size={64} />
      </div>
      <h3 className="font-hand text-2xl mb-3 text-center">{title}</h3>
      <p className="text-pencil text-center">{description}</p>
      <div className={`mt-4 h-1 bg-${color} rounded-full mx-auto w-1/2`}></div>
    </div>
  );
}

