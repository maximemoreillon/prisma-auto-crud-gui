import { createRouter, createWebHistory } from "vue-router";

import Home from '@/views/Home.vue'
import Items from '@/views/Items.vue'
import Item from '@/views/Item.vue'

const routes = [
    { name: 'home', path: '/', component: Home },
    { name: 'items', path: '/:table/', component: Items },
    { name: 'item', path: '/:table/:id', component: Item },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router