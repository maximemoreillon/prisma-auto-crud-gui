<template>
  <v-card variant="outlined">
    <v-toolbar>
      <v-toolbar-title>
        {{ table }}
      </v-toolbar-title>
      <v-spacer />
      <v-btn
        :to="`/${table}/${localItem.id}`"
        icon="mdi-eye"
        v-if="localItem"
      />
      <SetItemDialog
        :table="props.table"
        @selection="selectionHandler($event)"
      />
      <v-btn
        @click="emit('delete')"
        icon="mdi-delete"
        color="#c00000"
        v-if="localItem"
      />
    </v-toolbar>
    <v-card-text v-if="localItem">
      <v-row v-for="{ name } in primitiveFields" :key="name">
        <v-col cols="">
          {{ name }}
        </v-col>
        <v-col>
          {{ localItem[name] }}
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text v-else> Undefined </v-card-text>
  </v-card>
</template>

<script setup>
import { VRow, VCol, VSpacer } from "vuetify/components/VGrid";
import { VCard, VCardText } from "vuetify/components/VCard";
import { VToolbar, VToolbarTitle } from "vuetify/components/VToolbar";
import { VBtn } from "vuetify/components/VBtn";

import { ref, onMounted, computed } from "vue";
import SetItemDialog from "./SetItemDialog.vue";
import axios from "axios";

const props = defineProps({
  item: Object,
  table: String,
});

const emit = defineEmits(["update", "delete"]);

const fields = ref([]);
// Using a local item for optimistic update
const localItem = ref();

onMounted(() => {
  localItem.value = props.item;
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

const primitiveFields = computed(() =>
  fields.value.filter(
    // TODO: consider field.type otherwise
    (field) => field.name !== "id" && field.kind == "scalar"
  )
);

const selectionHandler = (event) => {
  emit("update", event.id);
  localItem.value = event;
};
</script>
