"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
const skills = [ 
    {
      name: "Code Conjurer",
      level: 4,
      type: "Active",
      effect: "Summons clean, scalable, maintainable code at will.",
      bonus: ["+40% readability", "+30% maintainability"],
      icon: "/images/xp/skills/skill2.png",
    },
    {
      name: "API Summoner",
      level: 4,
      type: "Active",
      effect: "Weaves REST and GraphQL APIs into any project with ease.",
      bonus: ["+20% fetch speed", "-10% integration errors"],
      icon: "/images/xp/skills/skill3.png",
    },
    {
      name: "Bug Slayer",
      level: 3,
      type: "Active",
      effect: "Detects and exterminates bugs in record time.",
      bonus: ["+50% debug speed", "+15% stress resistance"],
      icon: "/images/xp/skills/skill1.png",
    },
    {
      name: "Architect of Scalability",
      level: 2,
      type: "Ultimate",
      effect: "Builds systems ready for explosive growth without technical debt.",
      bonus: ["+40% system performance", "+30% load resilience"],
      icon: "/images/xp/skills/skill4.png",
    },
];

export default function HeroAvatar() {
    return (
        <div className="max-w-3xl mx-auto  text-gray-100 flex items-center flex-col mt-10 mb-20 md:mb-[150px]  px-5">
            <h2 className="text-2xl font-bold text-gray-300 text-center mb-8">
                Abilities
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 w-full max-w-6xl">
                {skills.map((skill, idx) => (
                <motion.div
                    key={idx}
                    whileTap={{ scale: 0.98 }}
                    style={{ backgroundColor: 'var(--bg-custom-dark)' }} 
                    className="bg-gray-800 rounded-md p-6 shadow-lg flex flex-col space-y-3 transition-all hover:border-blue-500"
                >

                    <div className="">

                        <div className="flex gap-3">
                            <div className="text-4xl mb-3">
                                <img src={`${skill.icon}`} className="w-[84px]" />
                            </div>
                            <div className="space-y-3">
                                <div className="text-lg font-bold">{skill.name}</div>
                                <div className="flex items-center mb-2">
                                    <div className="flex gap-1">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className={`w-2 h-2 rounded-full ${
                                            i < skill.level ? "bg-yellow-400" : "bg-gray-600"
                                            }`}
                                        ></div>
                                        ))}
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500">{skill.type} Skill - Level {skill.level}</div>
                            </div>
                        </div>
                       
                        <div className="space-y-3">
                            
                            <div className="text-base text-gray-300">{skill.effect}</div>
                            <div className=" text-gray-400 text-sm/6">
                                {skill.bonus.map((bonus, i) => (
                                    <div key={i}>{bonus}</div>
                                ))}
                                
                            </div>
                        </div>
                    </div>
                    
                    
                </motion.div>
                ))}
            </div>
        </div>
    )}