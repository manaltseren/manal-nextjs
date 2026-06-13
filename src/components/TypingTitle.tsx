"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Props {
  text: string;
  className?: string;
  inView?: boolean;
  speed?: number;
}

export default function TypingTitle({ text, className, inView = true, speed = 75 }: Props) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!inView) return;
    setDisplayed("");
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [inView, text, speed]);

  return (
    <span className={className}>
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.55, repeat: Infinity, repeatType: "reverse" }}
        // hide cursor once done typing only if you want — keeping it blinks like a terminal
        style={{ marginLeft: 1 }}
      >
        _
      </motion.span>
    </span>
  );
}
