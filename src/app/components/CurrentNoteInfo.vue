<template>
    <div class="current-note-info">
        <div class="singing-note">
            <span class="note-info-description">Current</span>
            <span class="current-note">{{ currentNote }}</span>
            <div class="divider"></div>
            <span class="current-hertz">{{ currentHertz }} Hz</span>
        </div>
        <div class="expected-note">
            <span class="note-info-description">Expected</span>
            <span class="current-note">{{ expectedNote }}</span>
            <div class="divider"></div>
            <span class="current-hertz">{{ expectedHertz }} Hz</span>
        </div>
    </div>
</template>

<script setup lang="ts">

import {defineProps} from 'vue';

defineProps<{
    currentNote: string,
    currentHertz: number,
    expectedNote: string,
    expectedHertz: number
}>()

</script>

<style scoped>
    .current-note-info {
        display: flex;
        margin: 30px;
        border-radius: 20px;
        border: 5px solid rgb(255, 216, 100);
        outline: 5px solid white;
        background-color: white;
        color: lightgray;
    }

    .singing-note {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        height: 100%;
        width: 65%;
    }

    .current-note {
        color: lightgray;
        font-size: 4rem;
    }

    .current-hertz {
        color: lightgray;
        font-size: 2rem;
    }

    .divider {
        width: 80%;
        height: 2px;
        background-color: lightgray;
    }

    .expected-note {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        color: lightgray;
        width: 35%;
        font-size: 4rem;
        border-left: 5px solid rgb(255, 216, 100);
    }

    .note-info-description {
        font-size: 16px;
        color: lightgray;
    }
</style>