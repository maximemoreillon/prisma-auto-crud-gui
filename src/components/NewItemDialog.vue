<template>
  <v-dialog v-model="dialog" max-width="60rem">
    <template v-slot:activator="{ props }">
      <v-btn color="primary" v-bind="props" icon="mdi-plus" />
    </template>

    <v-card :title="`New ${table}`" :loading="fieldsLoading">
      <v-form @submit.prevent="createItem()">
        <v-card-text>
          <v-row v-for="field in fields" :key="field.name">
            <v-col
              v-if="
                field.name !== 'id' && ['String', 'Int'].includes(field.type)
              "
            >
              <v-text-field
                :label="field.name"
                v-model="newitem[field.name]"
              ></v-text-field>
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
import { ref, onMounted, computed, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

import { axios } from "../main";

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
</script>
