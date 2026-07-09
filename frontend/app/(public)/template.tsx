"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Transisi antarhalaman: template di-remount Next.js pada tiap navigasi,
 * jadi konten baru masuk dengan fade + slide halus — tanpa loader layar
 * penuh. Header/footer di layout tidak ikut dianimasikan.
 */
export default function PublicTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
