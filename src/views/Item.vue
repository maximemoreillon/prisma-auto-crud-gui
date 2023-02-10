<template>
  <v-card :loading="loading">
    <v-toolbar flat>
      <v-btn icon="mdi-arrow-left" @click="router.back()" />
      <v-toolbar-title>{{ table }} {{ id }}</v-toolbar-title>
      <v-spacer />
      <v-btn @click="updateItem" icon="mdi-content-save" :loading="updating" />
      <v-btn
        @click="deleteItem()"
        icon="mdi-delete"
        color="error"
        :loading="deleting"
      />
    </v-toolbar>
    <template v-if="item">
      <!-- Properties of the item itself -->
      <!-- TODO: don't show foreign keys -->
      <v-card-text>
        <v-row v-for="{ name } in primitiveFields" :key="name">
          <v-col>
            <v-text-field :label="name" v-model="item[name]" />
          </v-col>
        </v-row>
      </v-card-text>

      <!-- Related items -->
      <v-card-text v-for="{ name } in fieldsWithForeignKeys" :key="name">
        <Relateditem :table="name" :item="item[name]" />
      </v-card-text>

      <v-card-text v-for="{ name } in fieldsFromOtherTables" :key="name">
        <RelatedItemsTable :items="item[name]" :table="name" />
      </v-card-text>
    </template>
  </v-card>

  <v-snackbar v-model="snackbar.show">
    <span>{{ snackbar.text }}</span>
    <template v-slot:actions>
      <v-btn icon="mdi-close" @click="snackbar.show = false" />
    </template>
  </v-snackbar>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, inject, computed, reactive, watch } from "vue";
import RelatedItemsTable from "../components/RelatedItemsTable.vue";
import Relateditem from "../components/RelatedItem.vue";

const axios = inject("axios"); // inject axios
const route = useRoute();
const router = useRouter();

const table = computed(() => route.params.table);
const id = computed(() => route.params.id);

const item = ref(null);
const loading = ref(false);
const updating = ref(false);
const deleting = ref(false);
const fields = ref([]);
const snackbar = reactive({
  show: false,
  text: null,
});

onMounted(async () => {
  await getModel();
  await getitem();
});

watch(table, async () => {
  await getModel();
  await getitem();
});

const getitem = async () => {
  item.value = null;
  loading.value = true;
  try {
    const route = `/${table.value}/${id.value}`;
    const params = { includes: fieldsToInclude.value.map((f) => f.name) };
    const { data } = await axios.get(route, { params });
    item.value = data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const getModel = async () => {
  try {
    const route = `/models/${table.value}`;
    const { data } = await axios.get(route);
    fields.value = data.fields;
  } catch (error) {
    console.error(error);
  }
};

const updateItem = async () => {
  updating.value = true;
  try {
    const route = `/${table.value}/${id.value}`;
    await axios.put(route, item.value);
    snackbar.show = true;
    snackbar.text = `${table.value} ${id.value} updated`;
  } catch (error) {
    console.error(error);
  } finally {
    updating.value = false;
  }
};

const deleteItem = async () => {
  if (!confirm(`Delete ${table.value} ${id.value}?`)) return;
  deleting.value = true;
  try {
    const route = `/${table.value}/${id.value}`;
    await axios.delete(route);
    router.push({ name: "items", param: { table: table.value } });
  } catch (error) {
    console.error(error);
  } finally {
    deleting.value = false;
  }
};

const primitiveFields = computed(() =>
  fields.value.filter(
    // TODO: consider field.type otherwise
    (field) => field.name !== "id" && field.kind == "scalar"
  )
);

// Finding fields that are foreign keys, pointing to other items
const fieldsWithForeignKeys = computed(() =>
  fields.value.filter(
    (field) => field.relationFromFields && field.relationFromFields.length
  )
);

const fieldsToInclude = computed(() =>
  fields.value.filter((field) => field.kind === "object")
);

// TODO: find better name
const fieldsFromOtherTables = computed(() =>
  fields.value.filter(
    // TODO: totally not sure whether this is correct
    // NOTE: also relationToFields
    (field) => field.relationFromFields && !field.relationFromFields.length
  )
);
</script>
