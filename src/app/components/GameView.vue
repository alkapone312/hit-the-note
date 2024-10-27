<template>
    <div class="game-container">
        <div class="something"></div>
        <div>
            <NoteScale
                :snap-to-current-time="pinToDot"
                :snap-to-frequency="pinToDot"
                :notes="noteTrack.getNotes()"
                :current-time="time"
                :current-frequency="frequency"
                class="note-scale"
            ></NoteScale>
        </div>
        <CurrentNoteInfo
            :current-note="note"
            :current-hertz="frequency"
            :expected-note="expectedNote"
            :expected-hertz="expectedFrequency"
        />
        <div class="controls">
            <MediaPlayer
            v-if="file !== null"
            :file="file"
            v-model="time"
            @play="play"
            @pause="pause"
            class="media-player"
            ></MediaPlayer>
            <div class="note-scale-controls">
                <VCheckbox v-model="pinToDot">Snap to point</VCheckbox>
                <VButton class="control-button" @click="toneDown">Tone Down</VButton>
                <span class="current-tone">{{ currentTone }}</span>
                <VButton class="control-button" @click="toneUp">Tone up</VButton>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import PitchDetectionPipeline from '@/audio/PitchDetectionPipeline';
import NoteScale from './NoteScale.vue';
import { inject, ref, defineProps, watch } from 'vue';
import MediaPlayer from './MediaPlayer.vue';
import CurrentNoteInfo from './CurrentNoteInfo.vue'
import VCheckbox from './shared/VCheckbox.vue';
import { NoteFactory, NoteTrack } from '../../main.js'
import VButton from './shared/VButton.vue';

const pinToDot = ref(true);
const currentTone = ref(0);
const time = ref(0);
const frequency = ref(0);
const note = ref('C0');
const expectedNote = ref('C0');
const expectedFrequency = ref(0);
const pitchRecognition = inject<PitchDetectionPipeline>("pitchRecognition");
const noteFactory = inject<NoteFactory>('noteFactory');
const { noteTrack } = defineProps<{noteTrack: NoteTrack}>();

watch(time, (newTime: number) => {
    const note = noteTrack.getNote(newTime);
    console.log(newTime);
    console.log(note);
    if(note == null) return;
    expectedNote.value = note.getNote().getName();
    expectedFrequency.value = note.getNote().getFrequency();
});

const file = noteTrack.getSoundtrack();

pitchRecognition?.onPitchDetected((pitch) => {
    frequency.value = parseFloat(pitch.toFixed(2));
    note.value = noteFactory!.createClosestNoteForFrequency(pitch).getName();
});

function play() {
    pitchRecognition?.startDetection();
}

function pause() {
    pitchRecognition?.stopDetection();
}

function toneUp() {
    currentTone.value += 1;
    noteTrack.changeTone(1);
}

function toneDown() {
    currentTone.value -= 1;
    noteTrack.changeTone(-1);
}

</script>

<style scoped>
    .note-scale {
        box-sizing: content-box;
        border-left: 5px solid rgb(255, 216, 100);
        border-bottom: 5px solid rgb(255, 216, 100);
        outline: 5px solid white;
        border-bottom-left-radius: 20px;
    }

    .game-container {
        display: grid;
        grid-template-columns: 33.33% 66.66%;
        grid-template-rows: 66.66% 33.33%;
        width: 100%;
        height: 100%;
    }

    .controls {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 30px;
    }

    .note-scale-controls {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 30px;
    }

    .control-button {
        font-size: 2rem;
    }

    .current-tone {
        font-size: 2rem;
    }
</style>