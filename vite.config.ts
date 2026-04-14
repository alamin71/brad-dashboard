import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss()],
    define: {
      __API_BASE_URL__: JSON.stringify(env.API_BASE_URL ?? ""),
      __API_DEV_URL__: JSON.stringify(env.API_DEV_URL ?? ""),
    },
  };
});
