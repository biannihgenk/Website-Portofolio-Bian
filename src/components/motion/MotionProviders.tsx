"use client";

import React, { useEffect } from "react";
import { MotionConfig, motion, useReducedMotion } from "motion/react";

// Track whether initial hydration has completed so route transitions enhance
// in-app navigation without delaying first-paint SSR / hydration LCP.
let hasCompletedInitialHydration = false;

export function MotionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    hasCompletedInitialHydration = true;
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

export function RouteTransition({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();
  const shouldAnimate = hasCompletedInitialHydration && !shouldReduceMotion;

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: 6 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  yOffset = 18,
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: "some" }}
      transition={{
        duration: 0.42,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
