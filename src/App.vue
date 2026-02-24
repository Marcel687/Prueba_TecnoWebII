<script setup>
import NavBarView from "./components/NavBarView.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const showNavBar = () => route.name !== "login";
</script>

<template>
  <div class="app">
    <NavBarView v-if="showNavBar" />
    <main class="app-container">
      <router-view />
    </main>
  </div>
</template>

<style>
.app {
  min-height: 100vh;
  background-color: #f5f5f5;
}
.app-container {
  padding: 1rem;
}
</style>
