export const metadata = {
  description: 'Check out my portfolio web page showcasing my skills and projects.',
  openGraph: {
    title: 'Manalaa | Web Developer',
    description: 'Check out my portfolio web page showcasing my skills and projects.',
    url: 'https://manal.dev',
    siteName: 'Manalaa | Web Developer',
    type: 'website',
  },
  other: {
    'fb:app_id': '1722966035765577',
  },
};

import HeroAvatar from '@/components/hero/HeroAvatar';
import HeroSkills from '@/components/hero/HeroSkills';
import HeroInventory from '@/components/hero/HeroInventory';
import HeroQuests from '@/components/hero/HeroQuests';
import SectionDivider from '@/components/SectionDivider';
import StartCue from '@/components/StartCue';
import PixelReveal from '@/components/PixelReveal';

export default function Home() {
  return (
    <div className="relative">
      {/* Content — sits over the global synthwave background */}
      <div className="relative items-center justify-center text-white">
        {/* Title screen (desktop): hero centered in the sky band (header → top
            of the sun); the section ends just under the horizon so the first
            section heading peeks in over the dark floor. */}
        <section className="relative pt-32.5 md:pt-0 md:min-h-[calc(67svh+96px)]">
          <div className="md:min-h-[calc(67svh-170px)] md:pt-20 md:pb-6 md:flex md:items-center">
            <div className="w-full">
              <HeroAvatar />
            </div>
          </div>
          <div className="hidden md:block">
            <StartCue targetId="abilities" label="Scroll to abilities" />
          </div>
        </section>
        <div className="md:hidden">
          <SectionDivider />
        </div>

        {/* Stacked sections — each scan-wipes in (PixelReveal) as it scrolls
            into view. */}
        <div id="abilities" className="scroll-mt-24">
          <PixelReveal>
            <HeroSkills />
          </PixelReveal>
        </div>
        <SectionDivider />
        <PixelReveal>
          <HeroInventory />
        </PixelReveal>
        <SectionDivider />
        <PixelReveal duration={0.9}>
          <HeroQuests />
        </PixelReveal>
      </div>
    </div>
  );
}
