// eslint-config-next v16 mengekspor flat config langsung; FlatCompat
// lama tidak lagi kompatibel
import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Init state dari localStorage/matchMedia setelah mount adalah pola
      // hydration-safe yang disengaja (splash, tema, locale, kursor);
      // demikian pula penulisan document.cookie di event handler mode
      // mock. Aturan compiler baru ini diturunkan ke warning.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/immutability": "warn",
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
]);

export default eslintConfig;
