<template>
  <v-card :title="table" variant="outlined" :to="`/${table}/${item?.id}`">
    <v-card-text>
      <v-row v-for="{ name } in primitiveFields" :key="name">
        <v-col cols="">
          {{ name }}
        </v-col>
        <v-col>
          {{ item[name] }}
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted, inject, computed } from "vue";
const axios = inject("axios"); // inject axios

const props = defineProps({
  item: Object,
  table: String,
});

const fields = ref([]);

onMounted(() => {
  getFields();
});

const getFields = async () => {
  try {
    const route = `/models/${props.table}`;
    const { data } = await axios.get(route);
    fields.value = data.fields;
  } catch (error) {
    console.error(error);
  }
};

const primitiveFields = computed(() =>
  fields.value.filter(
    // TODO: consider field.type otherwise
    (field) => field.name !== "id" && field.kind == "scalar"
  )
);
</script>
