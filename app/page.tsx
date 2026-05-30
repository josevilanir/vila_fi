import { LandingNav } from '@/components/Landing/LandingNav'
import { HeroSection } from '@/components/Landing/HeroSection'
import { FeaturesSection } from '@/components/Landing/FeaturesSection'
import { PlansSection } from '@/components/Landing/PlansSection'
import { LandingFooter } from '@/components/Landing/LandingFooter'

export default function LandingPage() {
  return (
    <div className="grain min-h-screen bg-[#0d0c0b] text-[#f0eadd]">
      <LandingNav />
      <HeroSection />
      <FeaturesSection />
      <PlansSection />
      <LandingFooter />
    </div>
  )
}
