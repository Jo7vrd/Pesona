import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Masuk Admin",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="dark bg-background text-foreground flex min-h-svh items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-2">
          <Image
            src="/logo/pesona-kei-putih.png"
            alt="Pesona Kei"
            width={138}
            height={55}
            priority
            className="h-11 w-auto"
          />
          <span className="text-muted-foreground text-sm font-normal tracking-wide">
            admin
          </span>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Masuk ke panel admin</CardTitle>
            <CardDescription>
              Kelola konten kuliner, budaya, dan kamus bahasa Kei.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense>
              <LoginForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
