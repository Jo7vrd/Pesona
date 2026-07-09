"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Transisi antarhalaman: fade murni tanpa pergeseran vertikal supaya
 * konten tidak terasa "terdorong dari bawah" saat berpindah rute.
 */
export default function PublicTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: reduceMotion ? 1 : 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
