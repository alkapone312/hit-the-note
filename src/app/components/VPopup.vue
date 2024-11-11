<template>
    <div class="popup-container">
        <slot></slot>
    </div>
</template>

<script lang="ts" setup></script>

<style>
.popup-container {
    display: flex;
    padding: 20px;
    border: 5px solid white;
    outline: 5px solid rgb(255, 216, 100);
    border-radius: 20px;
    background-color: white;
    z-index: 1;
}
</style>