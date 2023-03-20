<!-- TODO: Pagination, sorting, ordering, search -->
<!-- TODO: allow deletion of related item -->
<template>
  <v-card variant="outlined">
    <v-toolbar>
      <v-toolbar-title>
        {{ table }}
      </v-toolbar-title>
      <v-spacer />
      <v-btn :to="`/${table}`" icon="mdi-eye" />
      <!-- TODO: preset current item as foreign_key key -->
      <NewItemDialog :table="props.table" :presets="newItemPresets" />
    </v-toolbar>
    <v-card-text>
      <v-table>
        <thead>
          <tr>
            <th v-for="field in fieldsToShow" :key="`header_${field.name}`">
              {{ field.name }}
            </th>
            <th>See</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :key="index">
            <td
              v-for="field in fieldsToShow"
              :key="`item_${item.index}_${field.name}`"
            >
              {{ item[field.name] }}
            </td>
            <td>
              <!-- FIXME: find way to not rely on id -->
              <v-btn
                icon="mdi-arrow-right"
                :to="{ name: 'item', params: { table, primaryKey: item.id } }"
                flat
              />
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { VTable } from "vuetify/components/VTable";
import { VCard, VCardText } from "vuetify/components/VCard";
import { VBtn } from "vuetify/components/VBtn";
import { VToolbar, VToolbarTitle } from "vuetify/components/VToolbar";
import { VSpacer } from "vuetify/components/VGrid";

import NewItemDialog from "../components/NewItemDialog.vue";

import { ref, onMounted, computed } from "vue";
import axios from "axios";

const props = defineProps({
  items: Object,
  table: String,
  currentTable: { type: String, default: "" },
  newItemPresets: { type: Object, default: {} },
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

// TODO: simplify the following computeds
const primitiveFields = computed(() =>
  fields.value.filter(({ kind }) => !["object"].includes(kind))
);

const fieldsToOtherTables = computed(() =>
  fields.value.filter(
    // TODO: totally not sure whether this is correct
    // NOTE: there is also relationToFields. Figure out which one to use
    (field) => field.relationToFields
  )
);

const fieldsToHide = computed(() =>
  fieldsToOtherTables.value.filter((f) => f.name === props.currentTable)
);

const fieldsToShow = computed(() =>
  primitiveFields.value.filter(
    ({ name }) =>
      !fieldsToHide.value.map((f) => f.relationFromFields[0]).includes(name)
  )
);
</script>
