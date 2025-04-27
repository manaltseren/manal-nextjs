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
        <div>
             <HeroAvatar />
             <HeroSkills />
             <HeroInventory />
             <HeroQuests />
        </div>
    );
}