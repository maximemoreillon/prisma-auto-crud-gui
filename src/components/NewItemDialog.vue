<template>
  <v-dialog v-model="dialog" max-width="60rem">
    <template v-slot:activator="{ props }">
      <v-btn color="primary" v-bind="props" icon="mdi-plus" />
    </template>

    <v-card :title="`New ${table}`" :loading="fieldsLoading">
      <v-form @submit.prevent="createItem()">
        <v-card-text>
          <!-- Primitive fields without foreign keys -->
          <v-row v-for="field in fieldsToInput" :key="field.name">
            <v-col>
              <v-text-field
                v-if="['Int', 'Float'].includes(field.type)"
                :label="field.name"
                type="number"
                v-model.number="newitem[field.name]"
              />
              <v-text-field
                v-else-if="['String'].includes(field.type)"
                :label="field.name"
                v-model="newitem[field.name]"
              />
              <v-text-field
                v-else
                disabled
                persistent-hint
                :label="field.name"
                :hint="`Type ${field.type} is not supported at the moment`"
              />
            </v-col>
          </v-row>

          <!-- Foreign keys -->
          <v-row v-for="field in fieldsWithForeignKeys" :key="field.name">
            <v-col>
              <v-text-field
                variant="outlined"
                :label="field.relationFromFields[0]"
                v-model="newitem[field.name]"
                readonly
              />
            </v-col>
            <v-col cols="auto">
              <SetItemDialog
                @selection="newitem[field.name] = $event"
                :table="field.name"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="dialog = false">Close</v-btn>
          <v-btn color="primary" type="submit" :loading="creating"
            >Create {{ table }}</v-btn
          >
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup>
// TODO: importing those might not have been necessary
import { VRow, VCol, VSpacer } from "vuetify/components/VGrid";
import { VCard, VCardText, VCardActions } from "vuetify/components/VCard";
import { VForm } from "vuetify/components/VForm";
import { VTextField } from "vuetify/components/VTextField";
import { VDialog } from "vuetify/components/VDialog";
import { VBtn } from "vuetify/components/VBtn";

import SetItemDialog from "./SetItemDialog.vue";

import { ref, onMounted, computed, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const router = useRouter();

const fields = ref([]);
const dialog = ref(false);
const fieldsLoading = ref(false);
const creating = ref(false);
const newitem = reactive({});

const table = computed(() => route.params.table);

onMounted(() => {
  getFields();
});

const getFields = async () => {
  fieldsLoading.value = true;
  try {
    const route = `/models/${table.value}`;
    const { data } = await axios.get(route);
    fields.value = data.fields;
  } catch (error) {
    console.error(error);
  } finally {
    fieldsLoading.value = false;
  }
};

const createItem = async () => {
  creating.value = true;
  try {
    const route = `/${table.value}`;
    const { data } = await axios.post(route, newitem);
    router.push({ name: "item", params: { table: table.value, id: data.id } });
  } catch (error) {
    console.error(error);
  } finally {
    creating.value = false;
  }
};

// Finding fields that are foreign keys, pointing to other items
const fieldsWithForeignKeys = computed(() =>
  fields.value.filter(
    (field) => field.relationFromFields && field.relationFromFields.length
  )
);

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

const primitiveFields = computed(() =>
  fields.value.filter(
    // TODO: consider field.type otherwise
    (field) => field.name !== "id" && field.kind == "scalar"
  )
);

const fieldsToInput = computed(() =>
  fields.value.filter(
    (field) =>
      !foreignKeys.value.includes(field.name) &&
      !fieldsFromOtherTables.value.includes(field.name) &&
      // TODO: allow adding related items
      field.kind !== "object" &&
      field.name !== "id"
  )
);
</script>
