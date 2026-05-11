"use client";
import { useEffect, useState } from "react";

const quests = [
    {
      title: "Chief Technology Officer",
      company: "Beauty Secrets LLC",
      years: "Jan 2022 - Present",
      description: "Forged a modular eCommerce system, infused with cutting-edge technologies. Established a stable IT realm for the company and led a guild of developers toward continuous growth and mastery.",
      reward: ["+8000 XP", "+5 Leadership Skills", "+1 Legendary Artifact (Own System)"],
      completed: false
    },
    {
      title: "Senior Web Developer",
      company: "Datacom LLC",
      years: "Nov 2018 - Nov 2023",
      description: "Ventured into larger digital territories, commanding junior developers, assigning quests, and mentoring fledgling coders. Delivered high-level system enhancements across massive projects.",
      reward: ["+6000 XP", "+4 Mentorship Badges","+2 Advanced Projects Completed"],
      completed: true
    },
    {
      title: "Web Developer",
      company: "Datacom LLC",
      years: "Feb 2018 - Nov 2018",
      description: "Crafted custom systems, honing coding abilities and battle-hardened logic through teamwork quests. Leveled up key software engineering skills.",
      reward: ["+3000 XP", "+2 Teamwork Medals"],
      completed: true
    },
    {
      title: "Fullstack Developer",
      company: "Beauty Secrets LLC",
      years: "Jan 2018 - Dec 2021",
      description: "Revived and enhanced ancient eCommerce codebases. Conjured new systems like user points and payment gateways. Studied architecture scrolls to master high-traffic optimizations.",
      reward: ["+5000 XP", "+3 System Architect Runes"],
      completed: true
    },
    {
      title: "Web Developer",
      company: "Hi-Fi Media Group",
      years: "Jun 2015 - Jan 2018",
      description: "Operated within the music commerce kingdom — redesigning, refactoring, and devising strategies to boost treasure sales. Embarked on side quests involving online radio and streaming magics.",
      reward: ["+4000 XP", "+2 Specializations (Radio & Streaming)"],
      completed: true
    },
    {
      title: "Web Developer",
      company: "Visualised Development LLC",
      years: "Jun 2013",
      description: "Began the journey. Forged early web designs and coded first commercial systems — specializing in enchanted hotel reservation platforms.",
      reward: ["+2000 XP", "+1 Novice Web Spellbook"],
      completed: true
    },
];

export default function HeroQuests() {
    const [showQuests, setShowQuests] = useState(false);

    useEffect(() => {
        // Simulate scroll-in effect
        const timer = setTimeout(() => setShowQuests(true), 300);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="max-w-3xl mx-auto px-5">
            <h2 className="text-2xl font-bold text-yellow-400 text-center mb-8 font-press-start">
                Quests
            </h2>

            {quests.map((quest, index) => (
                <div
                key={index}
                className={`relative group mb-8 p-8 rounded-md transition-all duration-500 bg-indigo-950 hover:bg-indigo-900 ${
                    showQuests ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
                >
                    {/* Normal Quest Info */}
                    <div className="transition-opacity duration-300 group-hover:opacity-0">
                        <h3 className="text-xl text-yellow-400 font-medium mb-2 font-press-start">{quest.title}</h3>
                        <div className="text-gray-500 space-y-1 text-sm md:flex md:gap-4 md:space-y-0">
                            <div>{quest.company}</div>
                            <div>{quest.years}</div> 

                        </div>
                        <div className="mt-5 text-base/7">
                            
                            
                            <div className="text-gray-300 mb-3">{quest.description}</div>
                            <div className="md:flex md:flex-column md:gap-6 text-gray-400 mb-3">
                                <div className="font-normal">Achievements:</div> 
                                <div className="flex-1 ">
                                    <div className="">
                                        {quest.reward.map((reward, i) => (
                                            <div key={i}>{reward}</div>
                                        ))}
                                    </div>
                                </div>

                                
                            </div>

                        
                        </div>
                    </div>
                    
                    {/* "Quest Completed!" Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="text-2xl text-yellow-400 font-extrabold animate-bounce font-press-start">
                        🎉 Quest Completed!
                        </div>
                    </div>
                   
                    
                </div>
            ))}
        </div>
    )
}