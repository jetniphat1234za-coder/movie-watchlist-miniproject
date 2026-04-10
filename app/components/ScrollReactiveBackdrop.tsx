"use client";

import { motion, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

export default function ScrollReactiveBackdrop() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.35 });

  const hueA = useTransform(smoothProgress, [0, 1], [235, 346]);
  const hueB = useTransform(smoothProgress, [0, 1], [190, 260]);
  const alphaA = useTransform(smoothProgress, [0, 1], [0.2, 0.35]);
  const alphaB = useTransform(smoothProgress, [0, 1], [0.16, 0.3]);
  const vignetteOpacity = useTransform(smoothProgress, [0, 1], [0.45, 0.62]);

  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 100;
      const y = (event.clientY / window.innerHeight) * 100;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY]);

  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${mouseX}% ${mouseY}%, rgba(255,255,255,0.11), transparent 70%)`;
  const primary = useMotionTemplate`radial-gradient(1200px 700px at 12% 0%, hsla(${hueA}, 90%, 60%, ${alphaA}), transparent 62%)`;
  const secondary = useMotionTemplate`radial-gradient(1100px 700px at 90% 18%, hsla(${hueB}, 95%, 58%, ${alphaB}), transparent 60%)`;
  const vignette = useMotionTemplate`radial-gradient(1600px 900px at 50% 120%, rgba(0,0,0,${vignetteOpacity}), transparent 70%)`;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div className="absolute inset-0 bg-[#050507]" />
      <motion.div className="absolute inset-0" style={{ backgroundImage: primary }} />
      <motion.div className="absolute inset-0" style={{ backgroundImage: secondary }} />
      <motion.div className="absolute inset-0" style={{ backgroundImage: vignette }} />
      <motion.div className="absolute inset-0 mix-blend-screen" style={{ backgroundImage: spotlight }} />
    </div>
  );
}
