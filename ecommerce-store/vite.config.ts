import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	plugins: [react(), tailwindcss()],

	resolve: {
		// Native tsconfig paths support (replaces vite-tsconfig-paths)
		tsconfigPaths: true,
	},

	server: {
		port: 5173,
		open: true, // auto open browser (nice DX)
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

		// Better chunking for performance
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes("node_modules")) {
						if (id.includes("react")) {
							return "react";
						}
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
