import { defineConfig } from "vite";

export default defineConfig({
  // Listen on all interfaces so the dev server is reachable from outside its
  // container.
  server: { host: true, port: 5173, strictPort: true },
});
