<template>
  <v-dialog v-model="dialog" max-width="60rem">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" icon="mdi-plus" />
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
                v-model.number="newItem[field.name]"
              />
              <v-text-field
                v-else-if="['String'].includes(field.type)"
                :label="field.name"
                v-model="newItem[field.name]"
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
          <v-row
            v-for="{
              name,
              relationFromFields,
              relationToFields,
            } in fieldsWithForeignKeysExludingPresets"
            :key="name"
          >
            <v-col>
              <div class="my-2">{{ relationFromFields[0] }}</div>
              <Relateditem
                :table="name"
                :item="newItem[name]"
                @delete="
                  updateRelatedItem(
                    relationFromFields[0],
                    null,
                    relationToFields[0]
                  )
                "
                @update="
                  updateRelatedItem(
                    relationFromFields[0],
                    $event,
                    relationToFields[0]
                  )
                "
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

// import SetItemDialog from "./SetItemDialog.vue";
import Relateditem from "../components/RelatedItem.vue";

import { ref, onMounted, computed, reactive } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const props = defineProps({
  table: String,
  presets: {
    type: Object,
    default: {},
  },
});

const router = useRouter();

const fields = ref([]);
const dialog = ref(false);
const fieldsLoading = ref(false);
const creating = ref(false);
const newItem = ref({});

onMounted(() => {
  newItem.value = props.presets;
  getFields();
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

const primaryKeyField = computed(
  () => fields.value.find(({ isId }) => isId)?.name
);

const createItem = async () => {
  creating.value = true;
  try {
    const route = `/${props.table}`;
    const { data } = await axios.post(route, newItem.value);
    router.push({
      name: "item",
      params: { table: props.table, primaryKey: data[primaryKeyField.value] },
    });
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

const fieldsWithForeignKeysExludingPresets = computed(() =>
  fieldsWithForeignKeys.value.filter(
    ({ relationFromFields }) => !props.presets[relationFromFields[0]]
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

const fieldsToInput = computed(() =>
  fields.value.filter(
    (field) =>
      !foreignKeys.value.includes(field.name) &&
      !fieldsFromOtherTables.value.includes(field.name) &&
      // TODO: allow adding related items
      field.kind !== "object" &&
      field.name !== primaryKeyField.value
  )
);

const updateRelatedItem = async (key, value, foreignKey) => {
  // FIXME: what if null?
  if (value) newItem.value[key] = value[foreignKey];
  else newItem.value[key] = undefined;
};
</script>
