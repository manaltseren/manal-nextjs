import { Roboto } from 'next/font/google';
import { Press_Start_2P } from 'next/font/google';
import 'line-awesome/dist/line-awesome/css/line-awesome.min.css';
import './globals.css';
import '../styles/main.scss';
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

export const metadata = {
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
      <body className={`${roboto.className} ${pressStart.variable}`}>
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
