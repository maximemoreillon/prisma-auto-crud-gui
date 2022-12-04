<template>
    <v-card :loading="loading">
        <v-toolbar flat>
            <v-btn icon="mdi-arrow-left" :to="{name: 'items', params: {table}}"/>
            <v-toolbar-title>Item {{ id }}</v-toolbar-title>
        </v-toolbar>
        <v-card-text v-if="item">
            <v-row v-for="field in fields" :key="field.name">
                <v-col>
                    <v-text-field
                        :label="field.name"
                        v-model="item[field.name]"
                    ></v-text-field>
                </v-col>
            </v-row>
        </v-card-text>

    </v-card>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted, inject, computed } from 'vue';

const axios = inject('axios')  // inject axios
const route = useRoute()

const item = ref(null)
const loading = ref(false)
const table = computed(() => route.params.table)
const id = computed(() => route.params.id)

const fields = ref([])

onMounted(async () => {
    await getModel()
    await getitem()
})

const getitem = async () => {
    loading.value = true
    try {
        const route = `/${table.value}/${id.value}`
        const { data } = await axios.get(route)
        item.value = data
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }
}

const getModel = async () => {
    try {
        const route = `/models/${table.value}`
        const { data } = await axios.get(route)
        fields.value = data.fields
    } catch (error) {
        console.error(error)
    } 
}


</script>