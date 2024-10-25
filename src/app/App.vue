<template>
  <main>
    <NoteScale
      :current-time="time"
      :current-frequency="frequency"
      :notes="notes"
    ></NoteScale>
  </main>
</template>

<script setup lang="ts">
import { PitchDetectionPipeline } from '../main';
import NoteScale from './components/NoteScale.vue';
import {ref, inject} from 'vue';

const notes = [
  { name: 'C4', pitch: 120, time: 0 },
  { name: 'D4', pitch: 62, time: 1 },
  { name: 'E4', pitch: 64, time: 2 },
];

const time = ref(0);
const frequency = ref(50);

const pitchRecognition = inject<PitchDetectionPipeline>("pitchRecognition");
pitchRecognition?.onPitchDetected(pitch => {
  frequency.value = pitch;
})

document.addEventListener('keydown', (e) => {
  if(e.key != 's') return;
  pitchRecognition?.startDetection();
  setInterval(() => {
    time.value += 30/1000
  }, 1000/30);
})
  

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
