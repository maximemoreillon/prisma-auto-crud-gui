// Plugins
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
// Utilities
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

// Added for NPM publish
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    // vuetify({
    //   autoImport: true,
    // }),
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
      entry: resolve(__dirname, "src/main.js"),
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
        // NEED TO IMPORT ALL COMPONENTS USED IN THE PLUGIN LIKE THAT
        "vuetify/components/VCard",
        "vuetify/components/VList",
        "vuetify/components/VTable",
        "vuetify/components/VBtn",
        "vuetify/components/VSelect",
        "vuetify/components/VToolbar",
        "vuetify/components/VPagination",
        "vuetify/components/VGrid",
        "vuetify/components/VDialog",
        "vuetify/components/VForm",
        "vuetify/components/VBtn",
        "vuetify/components/VDivider",
        "vuetify/components/VTextField",
        "vuetify/components/VSnackbar",
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
      // Added myself
      plugins: [],
    },
  },
});
