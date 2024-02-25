// Plugins
import vue from "@vitejs/plugin-vue";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

// Utilities
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

// Added for NPM publish
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
    }),
  ],
  define: { "process.env": {} },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
  },
  server: {
    port: 8080,
  },

  // Options to build an NPM package
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      name: "PrismaAutoCrudGui",
      // the proper extensions will be added
      fileName: "prisma-auto-crud-gui",
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [
        "vue",
        "vue-router", // adding vue-router solved the injection errors

        // THIS WAS THE SOURCE OF ALL MY PAIN
        /vuetify\/components\/*/,
      ],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: "Vue",
          // vuetify: "Vuetify", // Does not seem to have any effect
          // "vue-router": "VueRouter", // Does not seem to have any effect
        },
      },
    },
  },
});
