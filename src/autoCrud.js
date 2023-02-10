import Items from "./views/Items.vue";
import Item from "./views/Item.vue";

export const init = (router) => {
  router.addRoute({ name: "items", path: "/:table/", component: Items });
  router.addRoute({ name: "item", path: "/:table/:id", component: Item });
};
