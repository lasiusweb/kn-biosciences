import { HeroSlider } from "@/components/layout/hero-slider"
import { SpecializationSection } from "@/components/layout/specialization-section"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <HeroSlider />
      <SpecializationSection />
      
      {/* Placeholder for future sections */}
      <section className="py-24 px-4 md:px-8 lg:px-16 w-full text-center bg-white">
        <h2 className="text-3xl font-bold text-stone-900 mb-4">Featured Products and Trust Builders</h2>
        <p className="text-stone-600">Coming soon in Phase 4...</p>
      </section>
    </main>
  );
}