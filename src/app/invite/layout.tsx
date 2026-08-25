import type { Metadata } from 'next';
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: 'Урилга',
  description: 'Төрсөн өдрийн урилга',
  robots: { index: false, follow: false },
};

export default function InviteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={playfair.variable}>
      {/* This page stands alone — hide the portfolio chrome coming from the root layout */}
      <style>{`
        body > header,
        body > main > footer,
        .synthwave-bg { display: none !important; }
        html, body { background: #08050f !important; }
      `}</style>
      {children}
    </div>
  );
}
