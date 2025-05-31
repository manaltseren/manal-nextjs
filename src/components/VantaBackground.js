"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import NET from "vanta/dist/vanta.fog.min";
import { motion } from "framer-motion";

export default function VantaBackground({ children }) {
  const [vantaEffect, setVantaEffect] = useState(null);
  const vantaRef = useRef(null);

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        NET({
          el: vantaRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          highlightColor: 0x3cd2ff,
          midtoneColor: 0x222222,
          lowlightColor: 0xfe00ff,
          baseColor: 0x110606,
          blurFactor: 0.77,
          speed: 1.70
        })
      );
    }
    return () => vantaEffect && vantaEffect.destroy();
  }, [vantaEffect]);

  return <motion.div initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{
    duration: 0.5, ease: "easeOut"
  }} ref={vantaRef} className="fixed top-0 left-0 w-full h-full -z-10"></motion.div >;
}