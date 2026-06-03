import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { EvolutionLove } from '@/components/landing/EvolutionLove';
import { ThreeFundamentals } from '@/components/landing/ThreeFundamentals';
import { VillagesHubs } from '@/components/landing/VillagesHubs';
import { RegenPartnersPreview } from '@/components/landing/RegenPartnersPreview';
import { JoinCTA } from '@/components/landing/JoinCTA';
import { Footer } from '@/components/landing/Footer';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <EvolutionLove />
        <ThreeFundamentals />
        <VillagesHubs />
        <RegenPartnersPreview />
        <JoinCTA />
      </main>
      <Footer />
    </>
  );
}
