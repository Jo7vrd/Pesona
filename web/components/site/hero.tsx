"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
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

  return (
    <section
      ref={ref}
      aria-label="Sambutan Kei Kecil"
      className="relative flex min-h-svh items-end overflow-hidden"
    >
      <motion.div style={{ y: imageY }} className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=2400&q=80"
          alt="Pantai pasir putih Kei Kecil dengan laguna biru jernih"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="from-ocean-950/85 via-ocean-950/40 absolute inset-0 bg-gradient-to-t to-ocean-950/10" />
      </motion.div>

      <motion.div
        style={{ opacity: contentOpacity }}
        className="container-page relative pt-32 pb-24 text-white sm:pb-32"
      >
        <motion.p
          initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE_OUT_EXPO }}
          className="eyebrow text-lagoon-300 mb-5"
        >
          Maluku Tenggara · Indonesia
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: reduceMotion ? 0 : 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE_OUT_EXPO }}
          className="font-display text-display-xl max-w-4xl text-balance"
        >
          Surga kecil di timur Indonesia
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: EASE_OUT_EXPO }}
          className="text-lede mt-6 max-w-xl text-white/85"
        >
          Pasir sehalus tepung di Ngurbloat, laguna sebening kaca, dan budaya
          yang dijaga turun-temurun. Selamat datang di Kei Kecil.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: EASE_OUT_EXPO }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <Button
            asChild
            size="lg"
            className="bg-coral-600 hover:bg-coral-700 rounded-full px-7 text-white"
          >
            <Link href="/makanan">Jelajahi kuliner</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full border-white/40 bg-transparent px-7 text-white hover:bg-white/10 hover:text-white"
          >
            <Link href="/budaya">Kenali budaya</Link>
          </Button>
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
