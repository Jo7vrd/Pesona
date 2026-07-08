"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { adminApi, isMockMode, SESSION_COOKIE } from "@/lib/api/admin";
import { loginSchema, type LoginInput } from "@/lib/schemas/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginInput) {
    try {
      await adminApi.login(values.email, values.password);
      // Sesi 8 jam (§7.1). Di mode mock cookie di-set dari klien;
      // backend asli memakai httpOnly cookie dari server (BR-001).
      if (isMockMode) {
        document.cookie = `${SESSION_COOKIE}=1; path=/; max-age=${8 * 60 * 60}; samesite=lax`;
      }
      toast.success("Selamat datang kembali");
      router.replace(searchParams.get("dari") ?? "/admin/dashboard");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal masuk. Coba lagi."
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="admin@keikecil.id"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email ? (
          <p role="alert" className="text-destructive text-sm">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Kata sandi</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            className="pr-11"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={
              showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
            }
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="size-4" aria-hidden />
            ) : (
              <Eye className="size-4" aria-hidden />
            )}
          </button>
        </div>
        {errors.password ? (
          <p role="alert" className="text-destructive text-sm">
            {errors.password.message}
          </p>
        ) : null}
      </div>

      <Button type="submit" disabled={isSubmitting} className="h-11 w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Memeriksa…
          </>
        ) : (
          "Masuk"
        )}
      </Button>

      {isMockMode ? (
        <p className="text-muted-foreground text-center text-xs leading-relaxed">
          Mode demo — masuk dengan{" "}
          <code className="font-mono">admin@keikecil.id</code> /{" "}
          <code className="font-mono">KeiKecil#2026</code>
        </p>
      ) : null}
    </form>
  );
}
