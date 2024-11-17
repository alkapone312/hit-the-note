<template>
    <div class="list">
        <ListItem v-for="item in items" :metadata="item" @play="$emit('play', item)" @training="$emit('training', item)"></ListItem>
    </div>
</template>

<script setup lang="ts">
    import {ref, onMounted} from 'vue'
    import ListItem from './ListItem.vue';
    import HtnRequestFactory from '@App/services/api/htn/HtnRequestFactory';
    import NoteTrackMetadata from '@/note/NoteTrackMetadata';

    const items = ref<NoteTrackMetadata[]>([]);
    const htn = new HtnRequestFactory();

    onMounted(async () => {
        const tracks = (await htn.getNoteTracks()).get().getMetadata();
        items.value.push(...tracks)
    })
</script>

<style scoped>
</style>