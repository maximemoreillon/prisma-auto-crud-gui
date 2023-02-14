import Tables from "./views/Tables.vue";
import Items from "./views/Items.vue";
import Item from "./views/Item.vue";
import axios from "axios";

export const init = ({ router, apiUrl }) => {
  const routes = [
    { name: "tables", path: "/tables", component: Tables },
    { name: "items", path: "/:table/", component: Items },
    { name: "item", path: "/:table/:id", component: Item },
  ];

  routes.forEach(router.addRoute);
  axios.defaults.baseURL = apiUrl;
};

// TODO: figure out if smart
export { axios };
