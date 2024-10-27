<template>
  <main>
    <GameView v-if="noteTrack" :note-track="noteTrack"/>
  </main>
</template>

<script setup lang="ts">
import GameView from './components/GameView.vue';
import { inject, ref } from 'vue';
import {NoteFactory, NoteTrack} from '../main.js';

const noteFactory = inject<NoteFactory>('noteFactory')!
let file: File | null = null;
let noteTrack = ref<NoteTrack | null>(null);
  (async () => {
      const blob = await (await fetch('Dont-stop-me-now-lead-vocal-only.wav')).blob();
      file = new File([blob], 'Dont-stop-me-now-lead-vocal-only.wav', {type: blob.type})
      noteTrack.value = new NoteTrack(
        [
          noteFactory.createNoteInTimeForName('G3', 0, 1),
          noteFactory.createNoteInTimeForName('G3', 1, 2),
          noteFactory.createNoteInTimeForName('A3', 2, 3),
          noteFactory.createNoteInTimeForName('G3', 3, 4),
          noteFactory.createNoteInTimeForName('C4', 4, 5),
          noteFactory.createNoteInTimeForName('B3', 5, 6),

          noteFactory.createNoteInTimeForName('G3', 7, 8),
          noteFactory.createNoteInTimeForName('G3', 8, 9),
          noteFactory.createNoteInTimeForName('A3', 9, 10),
          noteFactory.createNoteInTimeForName('G3', 10, 11),
          noteFactory.createNoteInTimeForName('D4', 11, 12),
          noteFactory.createNoteInTimeForName('C4', 12, 13)
        ],
        file
      );
  })();

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
