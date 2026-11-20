import type { Metadata } from 'next';
import { Great_Vibes, Kaushan_Script, Playfair_Display } from 'next/font/google';
// Line Awesome icons are only used on this page
import 'line-awesome/dist/line-awesome/css/line-awesome.min.css';

const playfair = Playfair_Display({
  weight: ['400', '500', '600', '700', '800'],
  // Мессеж болон "Хүндэтгэсэн" мөр налуугаар гардаг тул жинхэнэ italic
  // хэлбэрийг нь татна — эс бөгөөс браузер хиймлээр налуулж муухай харагдана.
  style: ['normal', 'italic'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-playfair',
});

// Нэр болон "Happy" — кирилл үсэг дэмждэг гар бичмэл фонт
const vibes = Great_Vibes({
  weight: '400',
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-vibes',
});

// "Birthday" — бийрэн бичмэл
const kaushan = Kaushan_Script({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-brush',
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
    <div className={`${playfair.variable} ${vibes.variable} ${kaushan.variable}`}>
      {/* This page stands alone — hide the portfolio chrome coming from the root layout */}
      <style>{`
        body > header,
        body > main > footer,
        .synthwave-bg { display: none !important; }
        html, body { background: #050307 !important; }
      `}</style>
      {children}
    </div>
  );
}
