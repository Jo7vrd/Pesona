import { z } from "zod";

/**
 * Titik fokus foto sebagai nilai CSS object-position (mis. "50% 30%").
 * Diatur admin lewat pemetik pada ImageField; default tengah bila tak diisi.
 */
export const fotoPosisiField = z.string().trim().max(20);
