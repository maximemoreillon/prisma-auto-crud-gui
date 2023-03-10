<template>
  <AppTemplate :options="options">
    <template v-slot:nav>
      <v-list nav>
        <v-list-item
          prepend-icon="mdi-home"
          title="Home"
          :to="{ name: 'tables' }"
        />
        <v-divider />
        <v-list-item
          v-for="(table, index) in tables"
          :key="`table_${index}`"
          prepend-icon="mdi-format-list-bulleted"
          :title="table"
          :to="`/${table}/`"
        />
      </v-list>
    </template>
  </AppTemplate>
</template>

<script setup>
import AppTemplate from "@moreillon/vuetify3-application-template";
import "@moreillon/vuetify3-application-template/dist/style.css";
import { ref, onMounted } from "vue";
import axios from "axios";

const { VITE_TITLE, VITE_API_URL, VITE_LOGIN_URL, VITE_IDENTIFICATION_URL } =
  import.meta.env;

const options = ref({
  title: "Auto CRUD",
  author: "Maxime Moreillon",
  login_url: VITE_LOGIN_URL,
  identification_url: VITE_IDENTIFICATION_URL,
});

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
