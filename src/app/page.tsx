export const metadata = {
  description: 'Check out my portfolio web page showcasing my skills and projects.',
  openGraph: {
    title: 'Manalaa | Web Developer',
    description: 'Check out my portfolio web page showcasing my skills and projects.',
    url: 'https://manal.dev',
    siteName: 'Manalaa | Web Developer',
    images: [
      {
        url: 'https://manal.dev/images/social_thumbnail.jpg',
        width: 1200,
        height: 630,
        alt: 'My Preview Image',
      },
    ],
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

export default function Home() {
  return (
    <div className="relative">
      {/* Content — sits over the global synthwave background */}
      <div className="relative items-center justify-center text-white pt-32.5">
        <HeroAvatar />
        <SectionDivider />
        <HeroSkills />
        <SectionDivider />
        <HeroInventory />
        <SectionDivider />
        <HeroQuests />
      </div>
    </div>
  );
}
