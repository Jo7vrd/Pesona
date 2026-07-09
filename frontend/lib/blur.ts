/**
 * Placeholder blur bersama untuk next/image pada foto remote (yang tak
 * bisa memakai blur otomatis import statis). Gradien laut→pasir 8×8 px,
 * di-blur browser sehingga terasa seperti pratinjau foto.
 */
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#14506e"/><stop offset=".55" stop-color="#4d9db8"/><stop offset="1" stop-color="#e8e2d4"/></linearGradient></defs><rect width="8" height="8" fill="url(#g)"/></svg>`;

export const BLUR_DATA_URL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
