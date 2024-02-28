<template>
  <v-card :loading="loading">
    <v-toolbar flat>
      <v-btn icon="mdi-arrow-left" :to="{ name: 'tables' }" />
      <v-toolbar-title>{{ table }}</v-toolbar-title>
      <v-spacer />
      <NewItemDialog :table="(table as string)" />
    </v-toolbar>
    <v-divider />
    <v-card-text>
      <!-- TODO: search -->
      <v-data-table-server
        :headers="headers"
        :items="items"
        :items-length="total"
        :items-per-page="tableOptions.itemsPerPage"
        :page="tableOptions.page"
        :sort-by="tableOptions.sortBy"
        @update:options="handleOptionsUpdate"
      >
        <template v-slot:item.details="{ item }">
          <v-btn
            v-if="primaryKeyField"
            variant="flat"
            icon="mdi-eye"
            :to="{
              name: 'item',
              params: { table, primaryKey: item[primaryKeyField] },
            }"
          />
        </template>
      </v-data-table-server>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { VDataTableServer } from "vuetify/components/VDataTable";
import { VCard, VCardText } from "vuetify/components/VCard";
import { VDivider } from "vuetify/components/VDivider";
import { VToolbar, VToolbarTitle } from "vuetify/components/VToolbar";
import { VBtn } from "vuetify/components/VBtn";
import { VSpacer } from "vuetify/components/VGrid";

import NewItemDialog from "../components/NewItemDialog.vue";

import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";

const route = useRoute();
const router = useRouter();

const total = ref(0);
const items = ref([]);
const fields = ref<any[]>([]);
const loading = ref(false);
const table = computed(() => route.params.table);

const {
  page = "1",
  itemsPerPage = "10",
  sort = undefined,
  order = undefined,
} = route.query;

const tableOptions = ref({
  page: Number(page),
  itemsPerPage: Number(itemsPerPage),
  sortBy: [{ key: sort, order: order }] as any,
});

const primitiveFields = computed(() =>
  // TODO: consider field.type otherwise
  fields.value.filter(({ kind }) => kind === "scalar")
);

const primaryKeyField = computed(
  () => fields.value.find(({ isId }) => isId)?.name
);

const headers = computed(() => [
  { title: "See", value: "details" },

  ...primitiveFields.value.map(({ name }) => ({
    title: name,
    value: name,
    sortable: true,
  })),
]);

onMounted(() => {
  getFields();
  getItems();
});

watch(table, () => {
  if (!table.value) return;
  getFields();
  getItems();
});

const getItems = async (options: any = {}) => {
  loading.value = true;
  try {
    const {
      page = 1,
      itemsPerPage: take = 10,
      sortBy = [{ key: undefined, order: undefined }],
    } = options;

    const route = `/${table.value}`;

    const params = {
      sort: sortBy[0]?.key,
      order: sortBy[0]?.order,
      take,
      skip: take * (page - 1),
      // search: search.value,
    };

    const { data } = await axios.get(route, { params });

    items.value = data.items;
    total.value = data.total;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const getFields = async () => {
  try {
    const route = `/models/${table.value}`;
    const { data } = await axios.get(route);
    fields.value = data.fields;
  } catch (error) {
    console.error(error);
  }
};

function handleOptionsUpdate(e: any) {
  const currentQuery = route.query;
  const { itemsPerPage, page, sortBy, search } = e;
  const query: any = {
    ...currentQuery,
    itemsPerPage,
    page,
    search,
  };
  if (sortBy.length) {
    const { key: sort, order } = sortBy[0];
    query.sort = sort;
    query.order = order;
  } else {
    query.sort = undefined;
    query.order = undefined;
  }
  router.replace({
    query,
  });

  getItems(e);
}
</script>
