import { z } from "zod";

export const emergencySchema = z.object({
  nama: z.string().min(2, "Nama minimal 2 karakter").max(100),
  peran: z.string().min(2, "Peran minimal 2 karakter").max(150),
  telepon: z
    .string()
    .min(3, "Nomor minimal 3 karakter")
    .max(30, "Nomor maksimal 30 karakter"),
  ikon: z.enum(["phone", "anchor", "ambulance", "shield", "waves", "hospital"]),
  urutan: z.number().int().min(0).max(999),
});

export type EmergencyInput = z.infer<typeof emergencySchema>;
