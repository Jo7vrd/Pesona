/**
 * Format CJS dipertahankan: evaluasi .mjs oleh turbopack-node kadang
 * gagal intermiten ("PostCSS config is undefined") — CJS stabil.
 */
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
