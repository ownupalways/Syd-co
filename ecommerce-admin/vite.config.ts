import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    resolve: {
        // Native support for tsconfig paths in Vite 8
        tsconfigPaths: true,
    },
    server: {
        port: 5174,
        proxy: {
            "/api": {
                target: "http://localhost:5000",
                changeOrigin: true,
            },
            "/socket.io": {
                target: "http://localhost:5000",
                changeOrigin: true,
                ws: true,
            },
        },
    },
});
