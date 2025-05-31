"use client";
import { useEffect, useState } from "react";
import {Col, Row ,Flex, Image, Button, Card, Space, Timeline, Avatar, Modal  } from "antd";
import { CarryOutOutlined, LoadingOutlined } from '@ant-design/icons';
import { motion } from "framer-motion";

import HeroAvatar from "@/components/hero/HeroAvatar"; 
import HeroSkills from "@/components/hero/HeroSkills"; 
import HeroInventory from "@/components/hero/HeroInventory"; 
import HeroQuests from "@/components/hero/HeroQuests"; 

export const metadata = {
  title: 'Manalaa B - Web Developer',
  description: 'If the code doesnt bother you, dont bother it.',
  openGraph: {
    title: 'Manalaa B - Web Developer',
    description: 'If the code doesnt bother you, dont bother it.',
    url: 'https://manal.dev',
    images: [
      {
        url: 'https://kinsta.com/wp-content/uploads/2021/07/how-to-become-a-web-developer.jpg',
        width: 1200,
        height: 630,
        alt: 'manal.dev',
      },
    ],
    locale: 'en_US',
    type: 'website',
  }
};

export default function Home() {
    const [XpModalOpen, setXpModalOpen] = useState(false);

    return (
        <div className="
        bg-[url('/images/background-tr.jpg')] 
        bg-no-repeat 
        bg-130-auto 
        md:bg-auto-960
        bg-top-center

        ">
            <div className="items-center justify-center text-white pt-[100px]">
             <HeroAvatar />
             <HeroSkills />
             <HeroInventory />
             <HeroQuests />
            </div>
        </div>
        
    );
}