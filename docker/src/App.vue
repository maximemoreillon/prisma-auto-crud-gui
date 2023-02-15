<template>
  <v-app>
    <v-app-bar color="primary">
      <v-app-bar-title>{{
        VITE_TITLE || "Prisma Auto CRUD GUI"
      }}</v-app-bar-title>
    </v-app-bar>
    <v-main class="bg-grey-lighten-4">
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
const { VITE_TITLE } = import.meta.env;
</script>
