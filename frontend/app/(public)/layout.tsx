import { LocaleProvider } from "@/lib/i18n";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { CursorFollower } from "@/components/site/cursor-follower";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { SplashScreen } from "@/components/site/splash-screen";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LocaleProvider>
      <SplashScreen />
      <SmoothScroll />
      <CursorFollower />
      <SiteHeader />
      <main id="konten-utama">{children}</main>
      <SiteFooter />
    </LocaleProvider>
  );
}
