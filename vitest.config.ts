import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, ".") } },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    exclude: ["e2e/**", "node_modules/**", ".next/**"],
    coverage: { provider: "v8", reporter: ["text", "html"], include: ["lib/**/*.ts", "components/**/*.tsx"] },
  },
});
