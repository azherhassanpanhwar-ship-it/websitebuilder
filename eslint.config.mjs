import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    // `**/` prefix matches the directory at any depth — ESLint 9's
    // globalIgnores applies patterns as minimatch globs, but a leading
    // dot directory like `.next` is only reliably matched when anchored
    // with `**/`. This way the ignore works whether eslint runs from the
    // monorepo root or from `apps/web/`.
    "**/.next/**",
    "**/out/**",
    "**/build/**",
    "**/dist/**",
    "**/node_modules/**",
    "**/next-env.d.ts",
    "**/tsconfig.tsbuildinfo",
    "**/pnpm-lock.yaml",
  ]),
]);

export default eslintConfig;
