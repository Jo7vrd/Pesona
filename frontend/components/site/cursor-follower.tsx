"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

/**
 * Logo Pesona Kei kecil yang mengekor kursor dengan pegas halus.
 * Hanya aktif di perangkat berpointer presisi (bukan layar sentuh),
 * nonaktif saat prefers-reduced-motion, dan tidak menghalangi klik.
 */
export function CursorFollower() {
  const reduceMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 350, damping: 30, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 350, damping: 30, mass: 0.5 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX + 16);
      y.set(e.clientY + 18);
      setVisible(true);
    };
    const onLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [x, y]);

  if (reduceMotion || !enabled) return null;

  return (
    <motion.div
      aria-hidden
      style={{ x: springX, y: springY }}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.5 }}
      transition={{ duration: 0.25 }}
      className="pointer-events-none fixed top-0 left-0 z-[90]"
    >
      <Image
        src="/logo/pesona-mark.png"
        alt=""
        width={26}
        height={26}
        priority={false}
        className="size-[26px] drop-shadow-[0_1px_3px_rgba(8,29,41,0.35)]"
      />
    </motion.div>
  );
}
