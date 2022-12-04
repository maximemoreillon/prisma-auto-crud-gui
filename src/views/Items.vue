<template>
    <v-card :loading="loading">
        <v-toolbar flat>
            <v-btn icon="mdi-arrow-left" :to="{name: 'home'}" />
            <v-toolbar-title>{{ table }}</v-toolbar-title>
        </v-toolbar>
        <v-divider />
        <v-card-text>

            <v-table >
                <thead>
                    <tr>
                        <th v-for="field in fields" :key="`header_${field.name}`">{{field.name}}</th>

                        <th class="text-left">See</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in items" :key="item.id">
                        <td v-for="field in fields" :key="`item_${item.id}_${field.name}`">
                            {{ item[field.name] }}
                        </td>

                        <td>
                            <v-btn icon="mdi-eye" :to="{ name: 'item', params: {table, id: item.id}}" flat/>
                        </td>
                    </tr>

                </tbody>
            </v-table>
            <v-pagination v-model="page" :length="Math.ceil(total/pageSize)"></v-pagination>
        </v-card-text>

    </v-card>
</template>

<script setup>

import { useRoute } from 'vue-router';
import { ref, onMounted, inject, computed, watch } from 'vue';


const axios = inject('axios')  // inject axios
const route = useRoute()

const page = ref(1)
const pageSize = ref(3)

const total = ref(0)
const items = ref([])
const fields = ref([])
const loading = ref(false)
const table = computed(() => route.params.table)

onMounted(() => {
    getFields()
    getitems()
})

watch(page, () =>{
    getitems()
})

const getitems = async () => {
    loading.value = true
    try {
        const route = `/${table.value}`
        const params = { take: pageSize.value, skip: (page.value - 1) * pageSize.value }

        const { data } = await axios.get(route, { params })

        items.value = data.items
        total.value = data.total

    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }
}

const getFields = async () => {
    try {
        const route = `/models/${table.value}`
        const { data } = await axios.get(route)
        fields.value = data.fields
    } catch (error) {
        console.error(error)
    }
}

</script>