"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin } from "lucide-react";

import { navItems, siteConfig } from "@/lib/content/site";
import { useLocale } from "@/lib/i18n";
import { FooterParticles } from "@/components/site/footer-particles";

export function SiteFooter() {
  const { t } = useLocale();

  return (
    <footer className="bg-brand-gradient relative overflow-hidden text-white">
      <FooterParticles />
      <div className="container-page relative z-10 grid gap-12 py-16 md:grid-cols-[2fr_1fr_1fr] md:py-20">
        <div>
          <Image
            src="/logo/pesona-kei-putih.png"
            alt="Pesona Kei"
            width={150}
            height={60}
            className="h-12 w-auto"
          />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/85">
            {t.footer.desc}
          </p>
        </div>

        <nav aria-label="Navigasi footer">
          <p className="eyebrow mb-4 text-white/90">{t.footer.jelajahi}</p>
          <ul className="space-y-2.5">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-white/85 transition-colors hover:text-white"
                >
                  {t.nav[item.href] ?? item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="eyebrow mb-4 text-white/90">{t.footer.kontak}</p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5 text-white/85">
              <MapPin className="mt-0.5 size-4 shrink-0 text-white" />
              <span>{siteConfig.desa.alamat}</span>
            </li>
            <li>
              <a
                href={`mailto:${siteConfig.desa.email}`}
                className="flex items-center gap-2.5 text-white/85 transition-colors hover:text-white"
              >
                <Mail className="size-4 shrink-0 text-white" />
                <span>{siteConfig.desa.email}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/15">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/75 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.desa.nama},{" "}
            {siteConfig.desa.kabupaten}
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2.5">
              <Image
                src="/logo/kkn-putih.png"
                alt="Logo KKN"
                width={17}
                height={20}
                className="h-5 w-auto"
              />
              <span>Tim KKN Jelajah Kei Kecil 2026</span>
            </span>
            <Link
              href="/admin/login"
              className="underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              {t.footer.admin}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
