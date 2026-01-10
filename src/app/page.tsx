import { HeroSlider } from "@/components/layout/hero-slider"
import { SpecializationSection } from "@/components/layout/specialization-section"
import { TrustSection } from "@/components/layout/trust-section"
import { FeaturedProducts } from "@/components/layout/featured-products"
import { LatestNews } from "@/components/layout/latest-news"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <HeroSlider />
      <SpecializationSection />
      <TrustSection />
      <FeaturedProducts />
      <LatestNews />
    </main>
  );
}
