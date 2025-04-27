// import localFont from "next/font/local";
import { Raleway } from 'next/font/google';
import 'line-awesome/dist/line-awesome/css/line-awesome.min.css';
import "./globals.css";
import '../styles/main.scss';
import Header from "../components/Header";
import VantaBackground from "@/components/VantaBackground";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

export const metadata = {
  title: "Manalaa | Web Developer",
  description: "My portfolio web page",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en"  data-theme="dark">
      <body>
        {/* <Header /> */}
        <main className="flex flex-col items-center justify-center min-h-[calc(100vh-78px)] text-white mt-[78px]">
          {/* <VantaBackground /> */}
          {children}
        </main>
      </body>
    </html>
  );
}
