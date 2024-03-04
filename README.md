# Prisma Auto CRUD GUI

A Vue module built with Vuetify to automatically create views for each table managed by the [Prisma Auto CRU middleware](https://github.com/maximemoreillon/prisma-auto-crud)

## Usage

### As a Docker container

```bash
docker run -e VITE_API_URL=http://localhost:7070 -p 8080:80 moreillon/prisma-auto-crud-gui
```

### As a module in your Vue.js app

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
