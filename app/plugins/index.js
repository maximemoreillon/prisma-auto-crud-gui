/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import { loadFonts } from "./webfontloader";
import vuetify from "./vuetify";
import router from "../router";

import prismaAutoCrudGui from "../../src/main";
const apiUrl = import.meta.env.VITE_API_URL;

// WARNINGL ORDER IS IMPORTANT, MUST BE USED BEFORE ROUTER
export function registerPlugins(app) {
  loadFonts();
  app.use(prismaAutoCrudGui, { router, apiUrl });
  app.use(vuetify);
  app.use(router);
}
