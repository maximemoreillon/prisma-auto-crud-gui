/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import { loadFonts } from "./webfontloader";
import vuetify from "./vuetify";
import router from "../router";
import prismaAutoCrudGui from "@moreillon/prisma-auto-crud-vuetify";
const apiUrl = import.meta.env.VITE_API_URL;

// WARNING: Order is important
export function registerPlugins(app) {
  loadFonts();
  app.use(vuetify);
  app.use(prismaAutoCrudGui, { router, apiUrl });
  app.use(router);
}
