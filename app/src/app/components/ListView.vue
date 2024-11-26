<template>
    <div class="list">
        <VButton class="close-button" @click="$emit('close')"><VClose/></VButton>
        <ListItem class="file-list-item" :metadata="fileMetadata" @play="importTrack('play')" @training="importTrack('training')"/>
        <ListItem v-for="item in items" :metadata="item" @play="loadGame(item)" @training="loadTraining(item)"></ListItem>
    </div>
</template>

<script setup lang="ts">
    import {ref, onMounted} from 'vue'
    import HtnRequestFactory from '@App/services/api/htn/HtnRequestFactory';
    import NoteTrackMetadata from '@/note/NoteTrackMetadata';
    import VButton from './shared/VButton.vue';
    import VClose from './icons/VClose.vue';
    import Loading from '@App/utils/Loading';
    import ListItem from './ListItem.vue';
    import { NoteTrackImporter } from '../../main';
    
    const items = ref<NoteTrackMetadata[]>([]);
    const htn = new HtnRequestFactory();
    const fileMetadata = new NoteTrackMetadata('Load from file', 'User', 'nofile');
    const emit = defineEmits(['play', 'training'])

    
    function importTrack(action: string): void {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.htn';
        input.onchange = async (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (!file) {
                return;
            }

            try {
                const noteTrackImporter = new NoteTrackImporter();
                const noteTrack = await noteTrackImporter.import(file);
                if(action === 'play') {
                    emit('play', noteTrack)
                } else {
                    emit('training', noteTrack)
                }
            } catch (error) {
                console.error('Failed to import NoteTrack:', error);
            }
        };

        input.click();
    }

    async function loadGame(metadata: NoteTrackMetadata) {
        Loading.load(async () => {
            const noteTrack = await (await htn.getNoteTrack(metadata.getFilename())).get().getNoteTrack()
            emit('play', noteTrack);
        })
    }

    function loadTraining(metadata: NoteTrackMetadata) {
        Loading.load(async () => {
            const noteTrack = await (await htn.getNoteTrack(metadata.getFilename())).get().getNoteTrack()
            emit('training', noteTrack);
        })
    }

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
    flex-wrap: wrap;
    padding: 50px;
    margin: 20px;
    justify-content: center;
    overflow: auto;
    max-height: 75%;
    gap: 20px;
    background-color: #899cf4;
    border-radius: 20px;
    outline: 5px solid #c9d3ff;
}

.file-list-item {
    background-color: darkorange;
    outline: 5px solid darkorange;
}
</style>