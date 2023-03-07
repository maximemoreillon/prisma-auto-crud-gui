<template>
  <v-app>
    <v-app-bar color="secondary">
      <v-app-bar-title>{{ VITE_TITLE || "Auto CRUD" }}</v-app-bar-title>
    </v-app-bar>
    <v-main class="bg-grey-lighten-4">
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
// TODO: add vuetify3 application template
const { VITE_TITLE } = import.meta.env;
</script>
