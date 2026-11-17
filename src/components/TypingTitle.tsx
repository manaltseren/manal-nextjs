"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Props {
  text: string;
  className?: string;
  inView?: boolean;
  speed?: number;
}

/** Types `text` out one character at a time (starts when `inView`), with a
 *  blinking terminal cursor. Re-types from scratch each time `inView` turns on. */
export default function TypingTitle({ text, className, inView = true, speed = 75 }: Props) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setCount(i);
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => {
      clearInterval(interval);
      setCount(0);
    };
  }, [inView, text, speed]);

  return (
    <span className={className}>
      {text.slice(0, count)}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.55, repeat: Infinity, repeatType: "reverse" }}
        style={{ marginLeft: 1 }}
      >
        _
      </motion.span>
    </span>
  );
}
