<template>
  <main>
    <MainMenu v-if="panel == 'menu'" @load="loadPanel"></MainMenu>
    <ListView v-if="panel == 'list'" @play="loadGame" @training="loadTraining"></ListView>
    <GameView 
      v-if="panel == 'game' && noteTrack" 
      :note-track="noteTrack"
      @close="() => panel = 'menu'"
    />
    <TrainingView 
      v-if="panel == 'training' && noteTrack" 
      :note-track="noteTrack"
      @close="() => panel = 'menu'"
    />
    <NoteCreator
      v-if="panel == 'create'"
      @close="() => panel = 'menu'"
    ></NoteCreator>
  </main>
</template>

<script setup lang="ts">
import GameView from './components/GameView.vue';
import { ref } from 'vue';
import {NoteTrack} from '../main.js';
import MainMenu from './components/MainMenu.vue';
import NoteCreator from './components/NoteCreator.vue';
import ListView from './components/ListView.vue';
import NoteTrackMetadata from '@/note/NoteTrackMetadata';
import HtnRequestFactory from './services/api/htn/HtnRequestFactory';
import TrainingView from './components/TrainingView.vue';

const panel = ref('menu');
const htn = new HtnRequestFactory();
const noteTrack = ref<NoteTrack | null>(null);

function loadPanel(newPanel: string) {
  panel.value = newPanel;
}

async function loadGame(metadata: NoteTrackMetadata) {
  noteTrack.value = await (await htn.getNoteTrack(metadata.getFilename())).get().getNoteTrack()
  panel.value = 'game';
}

async function loadTraining(metadata: NoteTrackMetadata) {
  noteTrack.value = await (await htn.getNoteTrack(metadata.getFilename())).get().getNoteTrack()
  panel.value = 'training';
}

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
