import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths"; // Add this

export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		tsconfigPaths(), // This bridges the gap to your tsconfig paths
	],
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
