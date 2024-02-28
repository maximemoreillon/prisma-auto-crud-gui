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
      <v-form @submit.prevent="getItems()">
        <v-row no-gutters>
          <v-col>
            <v-text-field label="Search" v-model="search" />
          </v-col>
          <v-col cols="auto">
            <v-btn type="submit" icon="mdi-magnify" variant="flat" />
          </v-col>
          <v-spacer />
        </v-row>
      </v-form>

      <v-data-table-server
        :headers="headers"
        :items="items"
        :items-length="total"
        :items-per-page="tableOptions.itemsPerPage"
        :page="tableOptions.page"
        :sort-by="tableOptions.sortBy"
        @update:options="handleTableOptionsUpdate($event)"
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
const search = ref(route.query.search);
const tableOptions = ref({
  page: Number(route.query.page || "1"),
  itemsPerPage: Number(route.query.take || "10"),
  sortBy: [{ key: route.query.sort, order: route.query.order }] as any,
});

const table = computed(() => route.params.table);
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

const getItems = async () => {
  loading.value = true;

  try {
    const route = `/${table.value}`;

    const {
      page = 1,
      itemsPerPage: take = 10,
      sortBy = [{ key: undefined, order: undefined }],
    } = tableOptions.value;

    const params = {
      take,
      sort: sortBy[0]?.key,
      order: sortBy[0]?.order,
      skip: take * (page - 1),
      search: search.value,
    };

    saveParamsInUrlQuery(params);

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

function saveParamsInUrlQuery(params: any) {
  const currentQuery = route.query;

  const query: any = {
    ...currentQuery,
    ...params,
  };

  router.replace({
    query,
  });
}

function handleTableOptionsUpdate(event: any) {
  tableOptions.value = event;
  getItems();
}
</script>
