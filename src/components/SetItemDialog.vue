<!-- TODO: Pagination, sorting, ordering, search -->

<template>
  <v-dialog v-model="dialog" max-width="60rem">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" icon="mdi-pencil" />
    </template>

    <v-card :title="`Select ${table}`" :loading="fieldsLoading">
      <v-card-text>
        <v-table>
          <thead>
            <tr>
              <th
                v-for="field in primitiveFields"
                :key="`header_${field.name}`"
              >
                {{ field.name }}
              </th>
              <th class="text-left">select</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="index">
              <td
                v-for="field in primitiveFields"
                :key="`item_${index}_${field.name}`"
              >
                {{ item[field.name] }}
              </td>
              <td>
                <v-btn @click="itemSelected(item)">Select</v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { VCard, VCardText } from "vuetify/components/VCard";
import { ref, onMounted, computed } from "vue";
import { VTable } from "vuetify/components/VTable";
import { VDialog } from "vuetify/components/VDialog";
import { VBtn } from "vuetify/components/VBtn";

import axios from "axios";

const total = ref(0);
const items = ref([]);
const fields = ref([]);
const dialog = ref(false);
const fieldsLoading = ref(false);
const loading = ref(false);

const props = defineProps({
  table: String,
});

const emit = defineEmits(["selection"]);

onMounted(async () => {
  await getFields();
  await getItems();
});

const getFields = async () => {
  fieldsLoading.value = true;
  try {
    const route = `/models/${props.table}`;
    const { data } = await axios.get(route);
    fields.value = data.fields;
  } catch (error) {
    console.error(error);
  } finally {
    fieldsLoading.value = false;
  }
};

const getItems = async () => {
  loading.value = true;
  try {
    const route = `/${props.table}`;
    const params = {};
    const { data } = await axios.get(route, { params });

    items.value = data.items;
    total.value = data.total;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const primitiveFields = computed(() =>
  // TODO: consider field.type otherwise
  fields.value.filter(({ kind }) => kind === "scalar")
);

// TODO: return entire object
const itemSelected = (item) => {
  emit("selection", item);
  dialog.value = false;
};
</script>
