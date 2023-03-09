<template>
  <v-app>
    <v-app-bar color="secondary">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-app-bar-title>{{ VITE_TITLE || "Auto CRUD" }}</v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer">
      <v-list nav>
        <v-list-item
          prepend-icon="mdi-home"
          title="Home"
          :to="{ name: 'tables' }"
        />
        <v-divider></v-divider>
        <v-list-item
          v-for="(table, index) in tables"
          :key="`table_${index}`"
          prepend-icon="mdi-format-list-bulleted"
          :title="table"
          :to="`/${table}`"
        />
      </v-list>
    </v-navigation-drawer>

    <v-main class="bg-grey-lighten-4">
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
// TODO: add vuetify3 application template

import { ref, onMounted } from "vue";
import axios from "axios";

const { VITE_TITLE, VITE_API_URL } = import.meta.env;

const drawer = ref(false);
const loading = ref(false);
const tables = ref([]);

onMounted(() => {
  getTables();
});

const getTables = async () => {
  loading.value = true;
  try {
    const { data } = await axios.get(`${VITE_API_URL}/tables`);
    tables.value = data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>
