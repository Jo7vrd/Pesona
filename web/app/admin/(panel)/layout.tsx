import type { Metadata } from "next";

import { AdminShell } from "@/components/admin/admin-shell";
import { QueryProvider } from "@/components/admin/query-provider";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin Kei Kecil" },
  robots: { index: false, follow: false },
};

export default function AdminPanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <AdminShell>{children}</AdminShell>
    </QueryProvider>
  );
}
