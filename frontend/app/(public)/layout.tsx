import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { CursorFollower } from "@/components/site/cursor-follower";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SmoothScroll />
      <CursorFollower />
      <SiteHeader />
      <main id="konten-utama">{children}</main>
      <SiteFooter />
    </>
  );
}
