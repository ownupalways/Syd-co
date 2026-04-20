import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";


export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    // ← remove the resolve.tsconfigPaths block entirely
    server: {
        port: 5173,
        open: true,
        proxy: {
            "/api": {
                target: "http://localhost:5000",
                changeOrigin: true,
                secure: false,
            },
        },
    },
    build: {
        outDir: "dist",
        sourcemap: false,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes("node_modules")) {
                        if (id.includes("react")) return "react";
                    }
                },
            },
        },
        chunkSizeWarningLimit: 600,
    },
    preview: {
        port: 5173,
    },
});
