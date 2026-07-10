"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const STORAGE_KEY = "kk_splash_shown";
const MIN_VISIBLE_MS = 1100;
const MAX_VISIBLE_MS = 2600;
const HERO_IMAGE =
  "/images/u/1507525428034-b723cf961d3e.jpg";

/**
 * Splash kunjungan pertama (sekali per sesi tab): layar gradien brand
 * dengan logo, tampil singkat sambil font + foto hero dimuat di latar.
 * Dilewati sepenuhnya saat prefers-reduced-motion.
 */
export function SplashScreen() {
  const reduceMotion = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (reduceMotion || window.sessionStorage.getItem(STORAGE_KEY)) return;
    setShow(true);
    document.documentElement.style.overflow = "hidden";

    const start = performance.now();
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      const elapsed = performance.now() - start;
      window.setTimeout(
        () => {
          window.sessionStorage.setItem(STORAGE_KEY, "1");
          document.documentElement.style.overflow = "";
          setShow(false);
        },
        Math.max(0, MIN_VISIBLE_MS - elapsed)
      );
    };

    // Muat aset penting di balik splash: font + foto hero
    const heroImg = new window.Image();
    heroImg.src = HERO_IMAGE;
    const heroReady = new Promise((resolve) => {
      heroImg.onload = heroImg.onerror = resolve;
    });
    Promise.all([document.fonts.ready, heroReady]).then(finish);

    const maxTimer = window.setTimeout(finish, MAX_VISIBLE_MS);
    return () => {
      window.clearTimeout(maxTimer);
      document.documentElement.style.overflow = "";
    };
  }, [reduceMotion]);

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          key="splash"
          exit={{ opacity: 0, scale: 1.06 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-brand-gradient fixed inset-0 z-[200] flex items-center justify-center"
          aria-label="Memuat Pesona Kei"
          role="status"
        >
          <motion.div
            aria-hidden
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.15, 0.4, 0.15] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background:
                "radial-gradient(ellipse at 30% 20%, rgba(53,194,232,0.55), transparent 55%)",
            }}
          />
          <div className="relative flex flex-col items-center gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src="/logo/pesona-kei-putih.png"
                alt="Pesona Kei"
                width={260}
                height={104}
                priority
                className="h-20 w-auto md:h-24"
              />
            </motion.div>
            <motion.div
              aria-hidden
              className="h-0.5 w-40 overflow-hidden rounded-full bg-white/25"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.div
                className="h-full w-1/3 rounded-full bg-white"
                animate={{ x: ["-100%", "300%"] }}
                transition={{
                  duration: 1.1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
