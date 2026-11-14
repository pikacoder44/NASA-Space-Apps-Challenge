'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useSpring, useInView, useReducedMotion } from 'framer-motion';

/**
 * Hook to detect reduced motion preference
 */
export function usePrefersReducedMotion(): boolean {
  const shouldReduceMotion = useReducedMotion();
  return Boolean(shouldReduceMotion);
}

/**
 * Scroll progress bar pinned to the top of the viewport
 */
export function ScrollProgress({ color = '#F2A65A' }: { color?: string }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      style={{
        scaleX,
        transformOrigin: '0%',
        backgroundColor: color
      }}
      className="fixed top-0 left-0 right-0 h-[2.5px] z-50 pointer-events-none"
      aria-hidden="true"
    />
  );
}

/**
 * Reveal: Smooth fade + 24px rise with once: true
 */
interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  yOffset?: number;
}

export function Reveal({
  children,
  delay = 0,
  duration = 0.6,
  className = '',
  yOffset = 24
}: RevealProps) {
  const shouldReduce = usePrefersReducedMotion();

  if (shouldReduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger container for lists & grid items
 */
interface StaggerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function Stagger({
  children,
  staggerDelay = 0.08,
  className = ''
}: StaggerProps) {
  const shouldReduce = usePrefersReducedMotion();

  if (shouldReduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = ''
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const shouldReduce = usePrefersReducedMotion();

  if (shouldReduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: 'easeOut' }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Animated number counter (runs once when in view)
 */
interface CountUpProps {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export function CountUp({
  to,
  prefix = '',
  suffix = '',
  duration = 1.2,
  className = ''
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);
  const shouldReduce = usePrefersReducedMotion();

  useEffect(() => {
    if (!isInView) return;
    if (shouldReduce) {
      const timer = setTimeout(() => setDisplayValue(to), 0);
      return () => clearTimeout(timer);
    }

    let start = 0;
    const stepTime = 16;
    const totalSteps = (duration * 1000) / stepTime;
    const increment = to / totalSteps;

    const intervalTimer = setInterval(() => {
      start += increment;
      if (start >= to) {
        setDisplayValue(to);
        clearInterval(intervalTimer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(intervalTimer);
  }, [isInView, to, duration, shouldReduce]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}
