<template>
    <v-card title="Home">
        <v-card-text>
            <v-list lines="one">
                <v-list-item v-for="table in tables" :key="table" :title="table" :to="{name: 'items', params: {table}}"></v-list-item>
            </v-list>
        </v-card-text>
    </v-card>
</template>

<script setup>

import { ref, onMounted, inject } from 'vue';

const axios = inject('axios')  // inject axios

const tables = ref([])
const loading = ref(false)

onMounted(() => {
    getTables()
})

const getTables = async () => {
    loading.value = true
    try {
        const {data} = await axios.get('/tables')
        tables.value = data
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = true
    }
}

</script>