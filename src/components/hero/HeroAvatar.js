import { motion } from "framer-motion";

export default function HeroAvatar() {
  return (
    <div className="flex flex-col items-center mb-10">
      {/* Avatar */}
      <motion.img
        src="/images/avatar.jpg"
        alt="Hero Avatar"
        className="w-36 h-36 rounded-md  mb-4 shadow-[0_0_0_7px_rgba(255,255,255,0.05)]"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
      />

      {/* Name */}
      <h1 className="text-4xl font-bold text-white mb-2 tracking-wide">
        Manalaa B.
      </h1>

      {/* Class / Level / XP */}
      <div className="flex items-center gap-4 text-gray-300 text-base">
        <span>⚔️ Class: FullStack Wizard</span>
        <span>⚡ Level: 13</span>
      </div>

      {/* XP Progress bar */}
      <div className="w-64 bg-gray-700 rounded-sm h-2 mt-4 overflow-hidden">
        <div
          className="bg-yellow-400 h-full"
          style={{ width: "77%" }}
        ></div>
      </div>

      <div className="text-sm text-gray-400 mt-1">XP: 7455 / 10000</div>
    </div>
  );
}