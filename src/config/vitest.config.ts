import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        include: ['./__tests__/**/*.test.ts'],
        globalSetup: ["./__tests__/setup.ts"],
        hookTimeout: 0,
        teardownTimeout: 50000,
    },
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "src"),
    },
  },
});