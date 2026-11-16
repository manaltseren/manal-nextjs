import ProjectShowcase from '@/components/portfolio/ProjectShowcase';
import PixelReveal from '@/components/PixelReveal';
import PressStart from '@/components/PressStart';

export const metadata = {
  title: 'Portfolio',
  description: 'Projects and builds by Manalaa — web developer.',
};

export default function PortfolioPage() {
  return (
    <div className="relative">
      {/* Content — sits over the global synthwave background */}
      <div className="relative text-white">
        {/* Title screen — the intro is centered in the sky band (header → top
            of the sun), and the section ends just under the horizon so the
            projects heading peeks in at the bottom of the first screen. */}
        <section className="relative min-h-[calc(67svh+96px)]">
          <div className="min-h-[calc(67svh-130px)] md:min-h-[calc(67svh-170px)] pt-20 pb-6 flex items-center">
            <div className="w-full max-w-5xl mx-auto px-5 text-center">
              <p className="font-press-start text-[9px] tracking-[0.3em] text-[#4edbec] mb-5">
                MANAL.DEV
              </p>
              <h1 className="font-press-start text-2xl md:text-4xl leading-tight text-white">
                PORTFOLIO
              </h1>
              <p className="font-pixel text-[22px] md:text-[26px] leading-tight text-white/70 mt-5 max-w-xl mx-auto">
                Things I&apos;ve built and shipped: shops, platforms, and tools for the web.
              </p>
            </div>
          </div>
          {/* Title-screen prompt, pinned mid-floor (below the horizon); gone
              once scrolling reveals the projects. */}
          <PressStart target="projects" />
        </section>

        <div id="projects" className="scroll-mt-24">
          <PixelReveal duration={0.9}>
            <ProjectShowcase />
          </PixelReveal>
        </div>
      </div>
    </div>
  );
}
