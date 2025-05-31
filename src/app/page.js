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