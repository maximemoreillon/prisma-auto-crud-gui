<template>
  <h3>{{ table }}</h3>
  <v-table>
    <thead>
      <tr>
        <th v-for="field in primitiveFields" :key="`header_${field.name}`">
          {{ field.name }}
        </th>
        <th class="text-left">See</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in items" :key="item.id">
        <td
          v-for="field in primitiveFields"
          :key="`item_${item.id}_${field.name}`"
        >
          {{ item[field.name] }}
        </td>
        <td>
          <v-btn
            icon="mdi-arrow-right"
            :to="{ name: 'item', params: { table, id: item.id } }"
            flat
          />
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup>
import { ref, onMounted, inject, computed } from "vue";
const axios = inject("axios"); // inject axios

const props = defineProps({
  items: Object,
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
  fields.value.filter(({ kind }) => !["object"].includes(kind))
);
</script>
