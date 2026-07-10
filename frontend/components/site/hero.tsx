"use client";

import { useRef, type MouseEvent } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ChevronDown } from "lucide-react";

import { useLocale } from "@/lib/i18n";
import { GlowButton } from "@/components/site/glow-button";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

declare global {
  interface Window {
    __lenis?: { scrollTo: (target: HTMLElement, opts?: object) => void };
  }
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { t } = useLocale();
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", reduceMotion ? "0%" : "15%"]
  );
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // Tilt 3D foto hero mengikuti kursor (±6°) plus pergeseran paralaks
  // ±14px agar kedalamannya terasa; skala 1.1 mencegah tepi terlihat
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const shiftX = useMotionValue(0);
  const springTilt = { stiffness: 110, damping: 16, mass: 0.6 };
  const tiltX = useSpring(rotateX, springTilt);
  const tiltY = useSpring(rotateY, springTilt);
  const panX = useSpring(shiftX, springTilt);

  function handleMouseMove(e: MouseEvent<HTMLElement>) {
    if (reduceMotion) return;
    const px = e.clientX / window.innerWidth - 0.5;
    const py = e.clientY / window.innerHeight - 0.5;
    rotateY.set(px * 6);
    rotateX.set(-py * 6);
    shiftX.set(px * -14);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
    shiftX.set(0);
  }

  function scrollToSambutan() {
    const el = document.getElementById("sambutan");
    if (!el) return;
    if (window.__lenis) {
      window.__lenis.scrollTo(el, { duration: 1.4 });
    } else {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <section
      ref={ref}
      aria-label="Sambutan Kei Kecil"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex min-h-svh items-center overflow-hidden"
    >
      <motion.div
        style={{
          y: imageY,
          x: panX,
          rotateX: tiltX,
          rotateY: tiltY,
          scale: 1.1,
          transformPerspective: 1100,
        }}
        className="absolute inset-0 will-change-transform"
      >
        <Image
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1800&q=75"
          alt="Pantai pasir putih Kei Kecil dengan laguna biru jernih"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Vignette diagonal: pekat di pojok kiri atas, larut ke kanan
            bawah — teks hero duduk di area tergelap */}
        <div className="from-ocean-950/90 via-ocean-950/45 to-ocean-950/0 absolute inset-0 bg-gradient-to-br via-40% to-80%" />
      </motion.div>

      <motion.div
        style={{ opacity: contentOpacity }}
        className="container-page relative w-full py-32 text-white"
      >
        <motion.p
          initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE_OUT_EXPO }}
          className="mb-4 text-3xl text-white md:text-4xl"
          style={{ fontFamily: "var(--font-brush)" }}
        >
          Maluku Tenggara, Indonesia
        </motion.p>
        <h1 className="font-display text-display-xl max-w-4xl font-bold text-balance">
          {t.hero.title.split(" ").map((kata, i) => (
            <motion.span
              key={i}
              className="inline-block whitespace-pre will-change-transform"
              initial={{ opacity: 0, y: reduceMotion ? 0 : 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.2 + i * 0.08,
                ease: EASE_OUT_EXPO,
              }}
            >
              {`${kata} `}
            </motion.span>
          ))}
        </h1>
        <motion.p
          initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: EASE_OUT_EXPO }}
          className="text-lede mt-6 max-w-xl text-white/85"
        >
          {t.hero.lede}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: EASE_OUT_EXPO }}
          className="mt-10"
        >
          <GlowButton onClick={scrollToSambutan}>{t.hero.cta}</GlowButton>
        </motion.div>
      </motion.div>

      <motion.a
        href="#sambutan"
        aria-label="Gulir ke bagian sambutan"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 transition-colors hover:text-white"
      >
        <ChevronDown
          className={reduceMotion ? "size-6" : "size-6 animate-bounce"}
        />
      </motion.a>
    </section>
  );
}
