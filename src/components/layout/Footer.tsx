import Link from 'next/link';
import { MedievalIcon } from '@/components/ui/MedievalIcon';

export function Footer() {
  return (
    <footer className="border-t-2 border-pencil bg-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-hand text-2xl mb-4">About</h3>
            <p className="text-sm text-pencil">
              The Cult of Trogdor the Burninator. Every account is a ledger
              entry. Burninate together.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-hand text-2xl mb-4">Links</h3>
            <ul className="space-y-2 text-sm">
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
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-accent-blue">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent-blue">
                  Discord
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent-blue">
                  Telegram
                </a>
              </li>
            </ul>
          </div>

          {/* Stats */}
          <div>
            <h3 className="font-hand text-2xl mb-4">Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Cult Members</span>
                <span className="font-bold">---</span>
              </div>
              <div className="flex justify-between">
                <span>Total Offerings</span>
                <span className="font-bold text-accent-green">---</span>
              </div>
              <div className="flex justify-between">
                <span>Images Generated</span>
                <span className="font-bold">---</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-sketch text-center text-sm text-pencil-light">
          <p>
            Trogdor the Burninator © 2003-2025 The Brothers Chaps. This is a
            fan tribute project.
          </p>
          <div className="mt-2 flex items-center justify-center gap-2">
            <span>Built with</span>
            <MedievalIcon name="torch" size={16} />
            <span>by the cult</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

