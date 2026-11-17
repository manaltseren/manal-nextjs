import { Press_Start_2P, Roboto, VT323 } from 'next/font/google';
import './globals.css';
import Footer from '../components/Footer';
import Header from '../components/Header';
import SynthwaveBackground from '../components/SynthwaveBackground';

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

const pressStart = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-press-start',
});

// Readable pixel font for body copy on the RPG pages (Press Start 2P is too
// dense for paragraphs).
const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pixel',
});

export const metadata = {
  metadataBase: new URL('https://manal.dev'),
  title: {
    template: '%s — Manalaa',
    default: 'Manalaa — Full-Stack Web Developer',
  },
  description: 'My portfolio web page',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <body className={`${roboto.className} ${pressStart.variable} ${vt323.variable}`}>
        <SynthwaveBackground />
        <Header />
        <main>
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
}
