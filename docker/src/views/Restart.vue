<template>
  <v-row class="mt-6" justify="center">
    <v-col cols="auto">
      <v-btn
        color="primary"
        prepend-icon="mdi-restart"
        :loading="loading"
        @click="restart()"
        >Restart back-end</v-btn
      >
    </v-col>
  </v-row>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";

const { VITE_API_URL } = import.meta.env;
const loading = ref(false);

const restart = async () => {
  loading.value = true;
  try {
    await axios.post(`${VITE_API_URL}/exit`);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>
