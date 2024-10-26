<template>
    <div class="game-container">
        <div class="something"></div>
        <div class="note-scale">
            <NoteScale
                :snap-to-current-time="pinToDot"
                :snap-to-frequency="pinToDot"
                :notes="notes"
                :current-time="time"
                :current-frequency="frequency"
            ></NoteScale>
        </div>
        <div class="current-note-info"></div>
        <div class="timeline">
            <VCheckbox v-model="pinToDot">Snap to </VCheckbox>
            <MediaPlayer
                v-if="file !== null"
                :file="file"
                v-model="time"
                @play="play"
                @pause="pause"
            ></MediaPlayer>
        </div>
    </div>
</template>

<script setup lang="ts">
import PitchDetectionPipeline from '@/audio/PitchDetectionPipeline';
import NoteScale from './NoteScale.vue';
import { inject, Ref, ref } from 'vue';
import MediaPlayer from './MediaPlayer.vue';
import VCheckbox from './shared/VCheckbox.vue';

const notes = [
    { name: 'C4', pitch: 120, time: 0 },
    { name: 'D4', pitch: 62, time: 1 },
    { name: 'E4', pitch: 64, time: 2 },
];
const pinToDot = ref(true);
const time = ref(0);
const frequency = ref(50);
const pitchRecognition = inject<PitchDetectionPipeline>("pitchRecognition");
let file: Ref<File | null> = ref(null);
pitchRecognition?.onPitchDetected((pitch) => {
    frequency.value = pitch;
});

function play() {
    pitchRecognition?.startDetection();
}

function pause() {
    pitchRecognition?.stopDetection();
}

(async () => {
    const blob = await (await fetch('Dont-stop-me-now-lead-vocal-only.wav')).blob();
    file.value = new File([blob], 'Dont-stop-me-now-lead-vocal-only.wav', {type: blob.type})
})();
</script>

<style scoped>
    .game-container {
        display: grid;
        grid-template-columns: 33.33% 66.66%;
        grid-template-rows: 66.66% 33.33%;
        width: 100%;
        height: 100%;
    }

    .current-note-info {
        background-color: white;
    }
</style>