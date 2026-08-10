import { z } from "zod";

/**
 * Titik fokus foto sebagai nilai CSS object-position (mis. "50% 30%").
 * Diatur admin lewat pemetik pada ImageField; default tengah bila tak diisi.
 */
export const fotoPosisiField = z.string().trim().max(20);

/** Skala/zoom foto untuk editor pembingkaian (1–3). Default 1. */
export const fotoZoomField = z.number().min(1).max(3);
