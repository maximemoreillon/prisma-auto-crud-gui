/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import { loadFonts } from "./webfontloader";
import vuetify from "./vuetify";
import router from "../router";

// Adding prisma auto crud
import prismaAutoCrudGui from "@moreillon/prisma-auto-crud-vuetify";
// import prismaAutoCrudGui from "../../../src/main";
// import "@moreillon/prisma-auto-crud-vuetify/dist/style.css";
const apiUrl = import.meta.env.VITE_API_URL;

// WARNING: Order is important
export function registerPlugins(app) {
  loadFonts();
  app.use(vuetify);
  app.use(prismaAutoCrudGui, { router, apiUrl });
  app.use(router);
}
