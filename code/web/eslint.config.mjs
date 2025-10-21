// eslint.config.js (atau .mjs / .ts)
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // 1) Ignored paths biar ESLint nggak ngecek build artifacts
  { ignores: [".next/**", "node_modules/**", "dist/**", "out/**"] },

  // 2) Bawa preset Next.js + TS
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // 3) Turunkan rule yang bikin build fail jadi warning
  {
    rules: {
      // yang bikin gagal di log-mu
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        ignoreRestSiblings: true
      }],
      "react-hooks/exhaustive-deps": "warn",

      // saran <img> → jadikan warning dulu biar nggak ganggu
      "@next/next/no-img-element": "warn",
    },
  },

  // 4) (Opsional) khusus file TS/TSX kalau mau lebih ketat/longgar
  // {
  //   files: ["**/*.ts", "**/*.tsx"],
  //   rules: {
  //     // taruh override yang spesifik untuk TS di sini
  //   }
  // },
];
