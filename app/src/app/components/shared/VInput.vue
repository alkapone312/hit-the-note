<template>
    <input class="input" :type="type" @change="(...args) => $emit('change', ...args)" :value="value" ref="input" :disabled="!!readonly"></input>
</template>

<script setup lang="ts">
    import { defineProps } from 'vue';

    defineProps<{
        value: string | number,
        type: string,
        readonly?: boolean
    }>();
</script>

<style scoped>
    .input {
        border: 0;
        outline: 0;
        width: 90px;
        height: 40px;
        font-size: 1.5rem;
        color: lightgray;
        text-align: center;
        border-radius: 10px;
    }

    .input:focus {
        border: 1px solid lightgray;
        padding: 10px;
    }

    .input:disabled {
        color: white;
    }
</style>