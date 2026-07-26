import { z } from "zod";

const nama = z.string().min(3, "Nama minimal 3 karakter").max(100);
const role = z.enum(["admin", "super_admin"]);

export const createAdminSchema = z.object({
  nama,
  username: z
    .string()
    .min(3, "Username minimal 3 karakter")
    .max(50, "Username maksimal 50 karakter")
    .regex(/^[a-zA-Z0-9]+$/, "Username hanya boleh huruf dan angka"),
  password: z.string().min(8, "Kata sandi minimal 8 karakter").max(100),
  role,
});

export const editAdminSchema = z.object({ nama, role });

export const resetPasswordSchema = z.object({
  password: z.string().min(8, "Kata sandi minimal 8 karakter").max(100),
});

export type CreateAdminForm = z.infer<typeof createAdminSchema>;
export type EditAdminForm = z.infer<typeof editAdminSchema>;
export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;
