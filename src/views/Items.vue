<template>
  <v-card :loading="loading">
    <v-toolbar flat>
      <v-btn icon="mdi-arrow-left" :to="{ name: 'home' }" />
      <v-toolbar-title>{{ table }}</v-toolbar-title>
      <v-spacer />
      <NewItemDialog />
    </v-toolbar>
    <v-divider />
    <v-card-text>
      <v-table>
        <thead>
          <tr>
            <th v-for="field in primitiveFields" :key="`header_${field.name}`">
              <v-btn
                variant="text"
                class="text-capitalize"
                :append-icon="headerButtonIcon(field)"
                @click="headerButtonClicked(field)"
              >
              </v-btn>
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
      <v-row>
        <v-col>
          <v-pagination
            v-model="page"
            :length="Math.ceil(total / take)"
          ></v-pagination>
        </v-col>
        <v-col cols="auto">
          <v-select
            :items="[5, 10, 50]"
            prefix="Items per page: "
            v-model="take"
          ></v-select>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import NewItemDialog from "@/components/NewItemDialog.vue";

import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, inject, computed, watch } from "vue";

const axios = inject("axios"); // inject axios
const route = useRoute();
const router = useRouter();

const total = ref(0);
const items = ref([]);
const fields = ref([]);
const loading = ref(false);
const table = computed(() => route.params.table);
const query = computed(() => route.query);

// Overly complicated and needs to be done for every parameter
// Will be simplified when Vuetify 3 releases data-tables
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
  get() {
    const { take = 10 } = query.value;
    return Number(take);
  },
  set(newVal) {
    updateQuery({ take: newVal });
  },
});

const sort = computed({
  get() {
    return query.value.sort || "id";
  },
  set(newVal) {
    updateQuery({ sort: newVal });
  },
});

const order = computed({
  get() {
    return query.value.order || "desc";
  },
  set(newVal) {
    updateQuery({ order: newVal });
  },
});

const updateQuery = (newItem) => {
  const query = { ...route.query, ...newItem };
  // Preventing route duplicates
  if (JSON.stringify(route.query) !== JSON.stringify(query))
    router.push({ query });
};

const primitiveFields = computed(() =>
  // TODO: consider using type Scalar
  fields.value.filter(({ kind }) => !["object"].includes(kind))
);

onMounted(() => {
  getFields();
  getItems();
});

watch(query, () => {
  getItems();
});

const getItems = async () => {
  loading.value = true;
  try {
    const route = `/${table.value}`;
    const params = { ...query.value };
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

const headerButtonIcon = (field) => {
  if (sort.value === field.name) {
    if (order.value === "desc") return "mdi-arrow-up";
    else return "mdi-arrow-down";
  } else return undefined;
};

const headerButtonClicked = (field) => {
  if (sort.value === field.name) {
    if (order.value === "desc") order.value = "asc";
    else order.value = "desc";
  } else {
    sort.value = field.name;
  }
};
</script>
