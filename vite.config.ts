import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
	server: {
		open: true,
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
