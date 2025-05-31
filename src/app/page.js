"use client";
import { useEffect, useState } from "react";
import {Col, Row ,Flex, Image, Button, Card, Space, Timeline, Avatar, Modal  } from "antd";
import { CarryOutOutlined, LoadingOutlined } from '@ant-design/icons';
import { motion } from "framer-motion";

import HeroAvatar from "@/components/hero/HeroAvatar"; 
import HeroSkills from "@/components/hero/HeroSkills"; 
import HeroInventory from "@/components/hero/HeroInventory"; 
import HeroQuests from "@/components/hero/HeroQuests"; 

export default function XpPage() {
    const [XpModalOpen, setXpModalOpen] = useState(false);

    return (
        <div className="
        bg-[url(https://cdn.steamstatic.com/steamcommunity/public/images/items/105600/0d184618c836603f7d729141e9b5856b1caae972.jpg)] 
        bg-no-repeat 
        bg-130-auto 
        md:bg-contain 
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