<template>
  <v-card title="Tables" max-width="30rem" class="mx-auto">
    <v-card-text>
      <v-list lines="one">
        <v-list-item
          v-for="model in models"
          :key="model.name"
          :title="model.name"
          :to="{ name: 'items', params: { table: model.name } }"
        />
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { VCard, VCardText } from "vuetify/components/VCard";
import { VList, VListItem } from "vuetify/components/VList";
import { ref, onMounted } from "vue";
import axios from "axios";

const models = ref([]);
const loading = ref(false);

onMounted(() => {
  getModels();
});

const getModels = async () => {
  loading.value = true;
  try {
    const { data } = await axios.get("/models");
    models.value = data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>
