"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";


const tools = [
    
    {
        name: "Laravel",
        icon: "/images/xp/items/laravel.png",
        rarity: "Legendary",
        description: "Elegant PHP web framework artisan."
    },
    { 
        name: "VS Code", 
        description: "Legendary Code Editor. +50% coding speed, +30% happiness.", 
        rarity: "Epic", 
        icon: "/images/xp/items/vscode.png" 
    },
    {
        name: "WordPress",
        icon: "/images/xp/items/wordpress.png",
        rarity: "Epic",
        description: "Blogging and CMS wizard with deep customization skills."
    },
    {
        name: "MySQL",
        icon: "/images/xp/items/mysql.png",
        rarity: "Rare",
        description: "Master of databases and complex queries."
    },
    
    {
        name: "Git",
        icon: "/images/xp/items/github.png",
        rarity: "Rare",
        description: "Expert in version control and GitFlow strategies."
    },
    { 
      name: "Figma", 
      description: "UI crafting weapon. +40% creativity.", 
      rarity: "Rare", 
      icon: "/images/xp/items/figma.png" 
    },
    {
        name: "Tailwind CSS",
        icon: "/images/xp/items/tailwindcss.png",
        rarity: "Uncommon",
        description: "Fast and efficient UI builder with utility-first magic."
    },
    { 
      name: "Postman", 
      description: "Master of APIs and requests. +35% network stability.", 
      rarity: "Rare", 
      icon: "/images/xp/items/postman.png" 
    }
];
 
  
const rarityColors = {
    Common: "border-gray-400",
    Rare: "border-blue-400",
    Epic: "border-purple-400",
    Legendary: "border-yellow-400",
};

function RandomSparkle({ color = "white", size = 6 }) {
    const [pos, setPos] = useState({ top: 0, left: 0 });
  
    useEffect(() => {
      const x = Math.random() * 100; // % of parent
      const y = Math.random() * 100;
      setPos({ top: y, left: x });
    }, []);
  
    return (
      <motion.div
        className="absolute rounded-full"
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: [0, 1, 1, 0],
          scale: [0, 1, 1, 0],
          y: [0, -10, 10, 0],
        }}
        transition={{
          duration: Math.random() * 2 + 2, // Random between 2-4s
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          top: `${pos.top}%`,
          left: `${pos.left}%`,
          width: size,
          height: size,
          backgroundColor: color,
          zIndex: -1,
        }}
      />
    );
}

export default function HeroInventory() {
    const [hoveredTool, setHoveredTool] = useState(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    
    return (
        <div className="max-w-3xl mx-auto text-gray-100 flex flex-col items-center mt-10 mb-20 md:mb-[150px] px-5">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 text-center mb-8">
                Inventory
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 w-full">
                {tools.map((tool, idx) => (
                <motion.div
                    style={{ backgroundColor: 'var(--bg-custom-dark)' }} 
                    key={idx}
                    onHoverStart={() => setHoveredTool(tool)}
                    onHoverEnd={() => setHoveredTool(null)}
                    onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
                    className={`bg-gray-800 rounded-lg p-4 border border-2 ${
                    rarityColors[tool.rarity]
                    } hover:shadow-[0_0_15px_5px_rgba(251,191,36,0.3)] transition-all flex flex-col items-center justify-center text-center space-y-2`}
                >
                    <div className="text-4xl">
                        <img src={`${tool.icon}`} className="w-[30px]" />
                    </div>
                    <div className="text-base font-medium">{tool.name}</div>
                </motion.div>
                ))}

                {/* Empty slots */}
                {Array.from({ length: Math.max(0, 8 - tools.length) }).map((_, idx) => (
                <div
                    key={`empty-${idx}`}
                    className="bg-gray-800 rounded-lg p-4 border border-gray-700 opacity-40"
                />
                ))}
            </div>

            {hoveredTool && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`absolute p-4 shadow-2xl rounded-xl text-center z-50 pointer-events-none overflow-hidden border border-2 ${
                    rarityColors[hoveredTool.rarity]
                    }`}
                    style={{
                    top: mousePos.y + 20,
                    left: mousePos.x + 20,
                    backgroundColor: 'var(--bg-custom-dark)',
                    width: "250px",
                    position: "fixed",
                    }}
                >
                    {/* ✨ Floating Sparkles */}
                    {(hoveredTool.rarity === "Epic" || hoveredTool.rarity === "Legendary") && (
                    <>
                        {Array.from({ length: 12 }).map((_, idx) => (
                        <RandomSparkle
                            key={idx}
                                color={
                                hoveredTool.rarity === "Legendary" ? "gold" : "lightblue"
                            }
                        />
                        ))}
                    </>
                    )}

                    {/* Popup content */}
                    <div className="relative z-10">
                    <div className="text-2xl mb-2">{hoveredTool.name}</div>
                    <div className="text-sm text-gray-300">{hoveredTool.description}</div>
                    <div className={`mt-2 text-xs text-${rarityColors[hoveredTool.rarity]}`}>{hoveredTool.rarity} Item</div>
                    </div>
                </motion.div>
            )}
        </div>
    )
}