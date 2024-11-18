<template>
    <div class="metadata-container">
        <VButton class="close-button" @click="$emit('close')"><VClose/></VButton>
        <div class="metadata-item" v-if="points">Points: {{ points }}</div>
        <div class="metadata-item">{{ metadata.getName() }}</div>
        <div class="metadata-item" v-if="metadata.getArtist()">{{ metadata.getArtist() }}</div>
    </div>
    <div class="ranking">
        <div></div>
    </div>
</template>

<script lang="ts" setup>
    import NoteTrackMetadata from '@/note/NoteTrackMetadata';
    import { defineProps } from 'vue';
    import VButton from './shared/VButton.vue';
    import VClose from './icons/VClose.vue';
    
    const {metadata} = defineProps<{
        points?: number,
        metadata: NoteTrackMetadata
    }>()
</script>

<style>
.metadata-container * {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    font-size: 2rem;
    color: lightgray;
    
}

.close-button {
    display: flex;
    width: 100px;
    height: 100px;
    margin: 15px;
}

.metadata-item {
    box-sizing: border-box;
    display: flex;
    padding-left: 20px;
    justify-content: center;
    border-radius: 20px;
    margin: 20px;
    width: calc(100% - 40px);
    height: 50px;
    background-color: #899cf4;
    color: white;
    text-wrap: nowrap;
    overflow: hidden;
}

.ranking {
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow: hidden;
    height: 100%;
    width: 100%;   
}
</style>