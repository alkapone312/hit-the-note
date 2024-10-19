<template>
  <main>
    <MainMenu class="main-menu"></MainMenu>
  </main>
</template>

<script setup lang="ts">
import MainMenu from './components/MainMenu.vue';
</script>

<style scoped>
main {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-menu {
  max-width: 300px;
}
</style>
