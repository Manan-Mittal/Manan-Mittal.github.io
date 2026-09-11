import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// NOTE: lovable-tagger used to run in dev. It stamps `data-lov-id` onto every
// JSX element, and react-three-fiber reads dashed props as nested property
// paths — so `data-lov-id` became `object.data.lov.id` and threw on every mesh.
// The 3D scene cannot coexist with it.
export default defineConfig(() => ({
  base: "/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2020",
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three"],
          r3f: ["@react-three/fiber", "@react-three/drei"],
        },
      },
    },
  },
}));
