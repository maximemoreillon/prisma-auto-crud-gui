<template>
    <v-card :title="table">
        <v-card-text>

            <v-table :loading="loading">
                <thead>
                    <tr>
                        <th class="text-left">ID</th>
                        <th class="text-left">See</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in items" :key="item.id">
                        <td>{{ item.id }}</td>
                        <td>
                            <v-btn icon="mdi-eye" :to="{ name: 'item', params: {table, id: item.id}}" flat/>
                        </td>
                    </tr>

                </tbody>
            </v-table>
        </v-card-text>

    </v-card>
</template>

<script setup>

import { useRoute } from 'vue-router';
import { ref, onMounted, inject, computed } from 'vue';

const axios = inject('axios')  // inject axios
const route = useRoute()

const items = ref([])
const loading = ref(false)
const table = computed(() => route.params.table)

onMounted(() => {
    getitems()
})

const getitems = async () => {
    loading.value = true
    try {
        const route = `/${table.value}`
        const { data } = await axios.get(route)
        items.value = data
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = true
    }
}

// TODO: Computed to get all properties
// OR: Get properties from back-end schema

</script>