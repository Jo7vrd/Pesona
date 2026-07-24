import { z } from "zod";

import { videoYoutubeField } from "@/lib/schemas/youtube";

/** Setelan situs yang bisa diubah operator desa lewat admin. */
export const settingsSchema = z.object({
  bahasaVideo: videoYoutubeField,
});

export type SettingsInput = z.infer<typeof settingsSchema>;
