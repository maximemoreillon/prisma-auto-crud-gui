# Prisma Auto CRUD GUI

A Vue module built with Vuetify to automatically create views for each table managed by the [Prisma Auto CRU middleware](https://github.com/maximemoreillon/prisma-auto-crud)

## TODO:

- [x] Axios straight from package, but have way to set base_url

## Usage

This module is to be imported in main.js and takes the vue Router as argument

```
import App from "./App.vue";
import router from "./router";
import { createApp } from "vue";

import { init } from "@moreillon/prisma-auto-crud-vuetify";
const apiUrl = 'http://yourapiurl';
init({router, apiUrl});

const app = createApp(App);

app
  .use(router)
  .mount("#app");

```
