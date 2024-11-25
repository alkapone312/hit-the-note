<template>
    <div class="list">
        <VButton class="close-button" @click="$emit('close')"><VClose/></VButton>
        <ListItem v-for="item in items" :metadata="item" @play="$emit('play', item)" @training="$emit('training', item)"></ListItem>
    </div>
</template>

<script setup lang="ts">
    import {ref, onMounted} from 'vue'
    import ListItem from './ListItem.vue';
    import HtnRequestFactory from '@App/services/api/htn/HtnRequestFactory';
    import NoteTrackMetadata from '@/note/NoteTrackMetadata';
    import VButton from './shared/VButton.vue';
    import VClose from './icons/VClose.vue';
    import Loading from '@App/utils/Loading';

    const items = ref<NoteTrackMetadata[]>([]);
    const htn = new HtnRequestFactory();

    onMounted(() => {
        Loading.load(async () => {
            const tracks = (await htn.getNoteTracks()).get().getMetadata();
            items.value.push(...tracks)
        })
    })
</script>

<style scoped>
.close-button {
    display: flex;
    position: absolute;
    left: 50px; 
    top: 50px;
}

.list {
    display: flex;
    padding: 50px;
    gap: 20px;
    background-color: #899cf4;
    border-radius: 20px;
    outline: 5px solid #c9d3ff;
}
</style>