// import localFont from "next/font/local";
import { Raleway } from 'next/font/google';
import { Roboto } from 'next/font/google';
import 'line-awesome/dist/line-awesome/css/line-awesome.min.css';
import "./globals.css";
import '../styles/main.scss';
import Header from "../components/Header";
import Footer from "../components/Footer";
import VantaBackground from "@/components/VantaBackground";

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'], // all weights you want
  subsets: ['latin', 'cyrillic'], // include both Latin and Cyrillic
  display: 'swap', // optional but recommended for performance
});

export const metadata = {
  title: "Manalaa | Web Developer",
  description: "My portfolio web page",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en"  data-theme="dark">
      <body className={roboto.className}>
        {/* <Header /> */}
        <main className="flex flex-col items-center justify-center min-h-[calc(100vh-78px)] text-white mt-[78px]">
          {/* <VantaBackground /> */}
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
