<template>
    <nav class="menu">
        <VButton @click="$emit('load', 'game')">Play!</VButton>
        <VButton @click="$emit('load', 'create')">Create</VButton>
        <VButton @click="$emit('load', 'settings')">Settings</VButton>
    </nav>
</template>

<script lang="ts" setup>
    import VButton from './shared/VButton.vue';
</script>

<style>
.menu {
  display: flex;
  gap: 30px;
  flex-direction: column;
  justify-content: space-around;
  padding: 20px;
  background-color: #899cf4;
  border: 5px solid rgba(0,0,0,0);
  outline: 5px solid #c9d3ff;
  border-radius: 30px;
  min-height: 300px;
}
</style>