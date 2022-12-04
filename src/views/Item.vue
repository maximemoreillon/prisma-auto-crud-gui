<template>
    <v-card :loading="loading">
        <v-toolbar flat>
            <v-btn icon="mdi-arrow-left" :to="{name: 'items', params: {table}}"/>
            <v-toolbar-title>Item {{ id }}</v-toolbar-title>
            <v-spacer />
            <v-btn @click="updateItem" icon="mdi-content-save" :loading="updating"/>
            <v-btn @click="deleteItem()" icon="mdi-delete" color="error" :loading="deleting"/>
        </v-toolbar>
        <v-card-text v-if="item">
            <v-row v-for="field in fields" :key="field.name">
                <v-col v-if="field.name !== 'id' && ['String', 'Int'].includes(field.type)">
                    <v-text-field
                        :label="field.name"
                        v-model="item[field.name]"
                    ></v-text-field>
                </v-col>
            </v-row>
        </v-card-text>

        <v-snackbar v-model="snackbar.show">
            <span>{{ snackbar.text }}</span>
            <template v-slot:actions>
                <v-btn icon="mdi-close" @click="snackbar.show = false"/>
            </template>
        </v-snackbar>
    </v-card>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted, inject, computed, reactive } from 'vue';

const axios = inject('axios')  // inject axios
const route = useRoute()
const router = useRouter()

const table = computed(() => route.params.table)
const id = computed(() => route.params.id)

const item = ref(null)
const loading = ref(false)
const updating = ref(false)
const deleting = ref(false)
const fields = ref([])
const snackbar = reactive({
    show: false,
    text: null
})

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

const updateItem = async () => {
    updating.value = true
    try {
        const route = `/${table.value}/${id.value}`
        await axios.put(route, item.value)
        snackbar.show = true
        snackbar.text = `${table.value} ${id.value} updated`
    } catch (error) {
        console.error(error)
    } finally {
        updating.value = false
    }
}

const deleteItem = async () => {
    if(!confirm(`Delete ${table.value} ${id.value}?`)) return
    deleting.value = true
    try {
        const route = `/${table.value}/${id.value}`
        await axios.delete(route)
        router.push({name: 'items', param: {table: table.value}})
        
    } catch (error) {
        console.error(error)
    } finally {
        deleting.value = false
    }
}




</script>