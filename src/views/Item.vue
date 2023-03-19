<template>
  <v-card :loading="loading">
    <v-toolbar flat>
      <v-btn icon="mdi-arrow-left" @click="router.back()" />
      <v-toolbar-title>{{ table }}</v-toolbar-title>
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
        <h3>properties</h3>
      </v-card-text>

      <v-card-text>
        <v-row
          v-for="{ name, type } in primitiveFieldsWithoutForeignKeys"
          :key="name"
        >
          <v-col>
            <v-text-field
              v-if="['Int', 'Float'].includes(type)"
              :label="name"
              type="number"
              v-model.number="item[name]"
            />

            <v-text-field v-else :label="name" v-model="item[name]" />
          </v-col>
        </v-row>
      </v-card-text>

      <!-- Related items -->
      <v-card-text>
        <h3>This {{ table }} to One relationships</h3>
      </v-card-text>
      <v-card-text
        v-for="{
          name,
          relationFromFields,
          relationToFields,
        } in fieldsWithForeignKeys"
        :key="name"
      >
        <Relateditem
          :table="name"
          :item="item[name]"
          @delete="
            updateRelatedItem(relationFromFields[0], null, relationToFields[0])
          "
          @update="
            updateRelatedItem(
              relationFromFields[0],
              $event,
              relationToFields[0]
            )
          "
        />
      </v-card-text>
      <v-card-text v-if="!fieldsWithForeignKeys.length"> None </v-card-text>

      <v-card-text>
        <h3>This {{ table }} to Many relationships</h3>
      </v-card-text>
      <v-card-text
        v-for="{
          name,
          relationFromFields,
          relationToFields,
        } in fieldsFromOtherTables"
        :key="name"
      >
        <RelatedItemsTable
          :items="item[name]"
          :table="name"
          :currentTable="table"
        />
      </v-card-text>
      <v-card-text v-if="!fieldsFromOtherTables.length"> None </v-card-text>
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
import { VCard, VCardText } from "vuetify/components/VCard";
import { VToolbar, VToolbarTitle } from "vuetify/components/VToolbar";
import { VBtn } from "vuetify/components/VBtn";
import { VSpacer } from "vuetify/components/VGrid";
import { VTextField } from "vuetify/components/VTextField";
import { VSnackbar } from "vuetify/components/VSnackbar";
import { VRow, VCol } from "vuetify/components/VGrid";

import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, computed, reactive, watch } from "vue";
import RelatedItemsTable from "../components/RelatedItemsTable.vue";
import Relateditem from "../components/RelatedItem.vue";
import axios from "axios";

const route = useRoute();
const router = useRouter();

const table = computed(() => route.params.table);
// TODO: stop relying on id
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
  await getItem();
});

watch(table, async () => {
  await getModel();
  await getItem();
});

const getItem = async () => {
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

    const body = primitiveFields.value.reduce(
      (prev, { name }) => ({ ...prev, [name]: item.value[name] }),
      {}
    );

    await axios.put(route, body);
    snackbar.show = true;
    snackbar.text = `${table.value} ${id.value} updated`;
  } catch (error) {
    console.error(error);
    snackbar.show = true;
    snackbar.text = `Update failed`;
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
    snackbar.show = true;
    snackbar.text = `Deletion failed`;
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

const primitiveFieldsWithoutForeignKeys = computed(() =>
  primitiveFields.value.filter(
    (field) => !foreignKeys.value.includes(field.name)
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
    // NOTE: there is also relationToFields. Figure out which one to use
    (field) => field.relationFromFields && !field.relationFromFields.length
  )
);

const foreignKeys = computed(() =>
  fieldsWithForeignKeys.value.map(
    ({ relationFromFields }) => relationFromFields[0]
  )
);

const updateRelatedItem = async (key, value, foreignKey) => {
  // TODO: get primary key
  item.value[key] = value[foreignKey];
  await updateItem();
  getItem();
};
</script>
