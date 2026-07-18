"use client";

import { BookA, Landmark, MapPin, UtensilsCrossed } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { adminApi } from "@/lib/api/admin";
import { StatCard } from "@/components/admin/stat-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function formatTanggal(iso: string | null) {
  if (!iso) return "Belum ada perubahan";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(iso));
}

export default function DashboardPage() {
  const { data, isPending } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => adminApi.stats(),
  });

  const modules = [
    {
      title: "Destinasi",
      icon: MapPin,
      href: "/admin/destinasi",
      stats: data?.destinasi,
    },
    {
      title: "Kuliner",
      icon: UtensilsCrossed,
      href: "/admin/makanan",
      stats: data?.makanan,
    },
    {
      title: "Budaya",
      icon: Landmark,
      href: "/admin/budaya",
      stats: data?.budaya,
    },
    {
      title: "Kosakata bahasa Kei",
      icon: BookA,
      href: "/admin/bahasa",
      stats: data?.bahasa,
    },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {modules.map((m) => (
          <StatCard
            key={m.href}
            title={m.title}
            value={m.stats?.total}
            caption="entri dipublikasikan"
            icon={m.icon}
            href={m.href}
            loading={isPending}
          />
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Aktivitas terakhir</CardTitle>
          <CardDescription>
            Kapan konten tiap modul terakhir kali diubah.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {modules.map((m) => (
              <li
                key={m.href}
                className="flex items-center justify-between gap-4 py-3 text-sm"
              >
                <span className="font-medium">{m.title}</span>
                <span className="text-muted-foreground">
                  {isPending
                    ? "Memuat…"
                    : formatTanggal(m.stats?.terakhirDiperbarui ?? null)}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
