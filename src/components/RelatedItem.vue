<template>
  <v-card variant="outlined">
    <v-toolbar>
      <v-toolbar-title>
        {{ table }}
      </v-toolbar-title>
      <v-spacer />
      <v-btn :to="`/${table}/${item.id}`" icon="mdi-eye" v-if="item" />
      <SetItemDialog :table="props.table" @selection="itemSelected($event)" />
      <v-btn
        @click="emit('delete')"
        icon="mdi-delete"
        color="#c00000"
        v-if="item"
      />
    </v-toolbar>
    <v-card-text v-if="item">
      <v-row v-for="{ name } in primitiveFields" :key="name">
        <v-col cols="">
          {{ name }}
        </v-col>
        <v-col>
          {{ item[name] }}
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text v-else> Undefined </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { axios } from "../main";
import SetItemDialog from "./SetItemDialog.vue";

const props = defineProps({
  item: Object,
  table: String,
});

const emit = defineEmits(["update", "delete"]);

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

const primitiveFields = computed(() =>
  fields.value.filter(
    // TODO: consider field.type otherwise
    (field) => field.name !== "id" && field.kind == "scalar"
  )
);

const itemSelected = (event) => {
  emit("update", event);
};
</script>
