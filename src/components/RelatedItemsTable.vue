<!-- TODO: Pagination, sorting, ordering, search -->
<!-- TODO: allow deletion of related item -->
<template>
  <v-card :title="table" variant="outlined">
    <v-card-text>
      <v-table>
        <thead>
          <tr>
            <th v-for="field in fieldsToShow" :key="`header_${field.name}`">
              {{ field.name }}
            </th>
            <th class="text-left">See</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td
              v-for="field in fieldsToShow"
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
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { axios } from "../main";

const props = defineProps({
  items: Object,
  table: String,
  currentTable: { type: String, default: "" },
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
