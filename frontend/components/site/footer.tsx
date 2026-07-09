import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin } from "lucide-react";

import { navItems, siteConfig } from "@/lib/content/site";

export function SiteFooter() {
  return (
    <footer className="bg-ocean-950 text-sand-100">
      <div className="container-page grid gap-12 py-16 md:grid-cols-[2fr_1fr_1fr] md:py-20">
        <div>
          <Image
            src="/logo/pesona-kei-putih.png"
            alt="Pesona Kei"
            width={150}
            height={60}
            className="h-12 w-auto"
          />
          <p className="text-sand-100/70 mt-5 max-w-sm text-sm leading-relaxed">
            {siteConfig.description}
          </p>
        </div>

        <nav aria-label="Navigasi footer">
          <p className="eyebrow text-lagoon-400 mb-4">Jelajahi</p>
          <ul className="space-y-2.5">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sand-100/80 text-sm transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="eyebrow text-lagoon-400 mb-4">Kontak</p>
          <ul className="space-y-3 text-sm">
            <li className="text-sand-100/80 flex items-start gap-2.5">
              <MapPin className="text-lagoon-400 mt-0.5 size-4 shrink-0" />
              <span>{siteConfig.desa.alamat}</span>
            </li>
            <li>
              <a
                href={`mailto:${siteConfig.desa.email}`}
                className="text-sand-100/80 flex items-center gap-2.5 transition-colors hover:text-white"
              >
                <Mail className="text-lagoon-400 size-4 shrink-0" />
                <span>{siteConfig.desa.email}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page text-sand-100/50 flex flex-col items-center justify-between gap-2 py-6 text-xs sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.desa.nama},{" "}
            {siteConfig.desa.kabupaten}
          </p>
          <div className="flex items-center gap-4">
            <p>Tim KKN Jelajah Kei Kecil 2026</p>
            <Link
              href="/admin/login"
              className="hover:text-white underline-offset-4 transition-colors hover:underline"
            >
              Masuk admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
