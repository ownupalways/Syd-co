import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			"@components": path.resolve(
				__dirname,
				"./src/components",
			),
			"@pages": path.resolve(
				__dirname,
				"./src/pages",
			),
			"@store": path.resolve(
				__dirname,
				"./src/store",
			),
			"@api": path.resolve(
				__dirname,
				"./src/api",
			),
			"@hooks": path.resolve(
				__dirname,
				"./src/hooks",
			),
			"@typings": path.resolve(
				__dirname,
				"./src/types",
			),
			"@utils": path.resolve(
				__dirname,
				"./src/utils",
			),
		},
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
