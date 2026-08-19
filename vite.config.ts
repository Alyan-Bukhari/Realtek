import fs from "node:fs";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

function copyStatic() {
  return {
    name: "copy-static",
    closeBundle() {
      const dist = path.resolve(__dirname, "dist");
      for (const dir of ["images", "css", "js"]) {
        const from = path.resolve(__dirname, dir);
        if (fs.existsSync(from)) {
          fs.cpSync(from, path.join(dist, dir), { recursive: true });
        }
      }
    }
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), copyStatic()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, ".")
    }
  },
  server: {
    port: 8765,
    strictPort: true
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        ceo: path.resolve(__dirname, "ceo.html"),
        project: path.resolve(__dirname, "project.html"),
        projects: path.resolve(__dirname, "projects.html")
      }
    }
  }
});
