import type { Metadata } from "next";
import { Suspense } from "react";

import { siteConfig } from "@/lib/content/site";
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
        <p className="font-display mb-8 text-center text-2xl text-white">
          {siteConfig.shortName}
          <span className="text-lagoon-400">.</span>
          <span className="text-muted-foreground ml-2 text-sm font-normal tracking-wide">
            admin
          </span>
        </p>
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
