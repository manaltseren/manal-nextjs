export const metadata = {
  title: "Manalaa | Web Developer",
  description: "Check out my portfolio web page showcasing my skills and projects.",
  openGraph: {
    title: "Manalaa | Web Developer",
    description: "Check out my portfolio web page showcasing my skills and projects.",
    url: "https://manal.dev",
    siteName: "Manalaa | Web Developer",
    images: [
      {
        url: "https://manal.dev/images/social_thumbnail.jpg",
        width: 1200,
        height: 630,
        alt: "My Preview Image",
      },
    ],
    type: "website",
  },
  other: {
    "fb:app_id": "1722966035765577",
  },
};

import HeroAvatar from "@/components/hero/HeroAvatar"; 
import HeroSkills from "@/components/hero/HeroSkills"; 
import HeroInventory from "@/components/hero/HeroInventory"; 
import HeroQuests from "@/components/hero/HeroQuests"; 

export default function Home() {

    return (
        <div className="
        bg-[url('/images/background-tr.png')] 
        bg-no-repeat 
        bg-130-auto 
        md:bg-auto-960
        bg-top-center

        ">
            <div className="items-center justify-center text-white pt-[130px]">
             <HeroAvatar />
             <HeroSkills />
             <HeroInventory />
             <HeroQuests />
            </div>
        </div>
        
    );
}