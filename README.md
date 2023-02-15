# Prisma Auto CRUD GUI

A Vue module built with Vuetify to automatically create views for each table managed by the [Prisma Auto CRU middleware](https://github.com/maximemoreillon/prisma-auto-crud)

## Usage

Configure the module to be used in src/plugins/index.js as such:

```
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
```
