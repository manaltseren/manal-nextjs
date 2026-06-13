import ProjectShowcase from '@/components/portfolio/ProjectShowcase';

export const metadata = {
  title: 'Portfolio',
  description: 'Projects and builds by Manalaa — web developer.',
};

export default function PortfolioPage() {
  return (
    <div className="relative">
      {/* Content — sits over the global synthwave background */}
      <div className="relative text-white pt-32.5 min-h-screen">
        <ProjectShowcase />
      </div>
    </div>
  );
}
