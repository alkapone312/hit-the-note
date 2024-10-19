<template>
    <nav class="menu">
        <Button>Play!</Button>
        <Button>Settings</Button>
    </nav>
</template>

<script lang="ts" setup>
    import Button from './shared/Button.vue';
</script>

<style>
.menu {
  display: flex;
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