<template>
  <v-row>
    <v-col>
      <v-pagination v-model="page" :length="Math.ceil(total / take)" />
    </v-col>
    <v-col cols="auto">
      <v-select :items="[5, 10, 50]" prefix="Items per page: " v-model="take" />
    </v-col>
  </v-row>
</template>

<script setup>
import { VPagination } from "vuetify/components/VPagination";
import { VSelect } from "vuetify/components/VSelect";
import { VRow, VCol } from "vuetify/components/VGrid";

import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const query = computed(() => route.query);

const updateQuery = (newItem) => {
  const query = { ...route.query, ...newItem };
  // Preventing route duplicates
  // TODO: find better way
  if (JSON.stringify(route.query) !== JSON.stringify(query))
    router.push({ query });
};

const props = defineProps({
  total: Number,
});

const page = computed({
  get() {
    const { skip = 0 } = query.value;
    return Number(skip) / Number(take.value) + 1;
  },
  set(newVal) {
    updateQuery({ skip: String((newVal - 1) * take.value) });
  },
});

const take = computed({
  // PROBLEM: does not get set by default
  get() {
    const { take = 10 } = query.value;
    return Number(take);
  },
  set(newVal) {
    updateQuery({ take: newVal });
  },
});
</script>
