import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/landing/HeroSection';
import { TenantsSection } from '@/components/landing/TenantsSection';
import { LeaderboardPreview } from '@/components/landing/LeaderboardPreview';

export default function HomePage() {
  return (
    <div className="min-h-screen notebook-paper">
      <Header />
      <main>
        <HeroSection />
        <TenantsSection />
        <LeaderboardPreview />
      </main>
      <Footer />
    </div>
  );
}

