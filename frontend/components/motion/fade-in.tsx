"use client";

import { motion, useReducedMotion } from "framer-motion";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      // amount "some": terpicu begitu sebagian elemen terlihat. Ambang 0.2
      // membuat konten yang lebih tinggi dari viewport (mis. artikel panjang)
      // tak pernah mencapai 20% → tetap opacity 0 (tampak blank) sampai
      // di-zoom-out. "some" mencegah itu.
      viewport={{ once: true, amount: "some" }}
      transition={{ duration: 0.6, delay, ease: EASE_OUT_EXPO }}
    >
      {children}
    </motion.div>
  );
}
