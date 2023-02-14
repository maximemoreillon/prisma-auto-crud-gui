<template>
  <v-card title="Tables" max-width="30rem" class="mx-auto">
    <v-card-text>
      <v-list lines="one">
        <v-list-item
          v-for="table in tables"
          :key="table"
          :title="table"
          :to="{ name: 'items', params: { table } }"
        ></v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { axios } from "../main";

const tables = ref([]);
const loading = ref(false);

onMounted(() => {
  getTables();
});

const getTables = async () => {
  loading.value = true;
  try {
    const { data } = await axios.get("/tables");
    tables.value = data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = true;
  }
};
</script>
