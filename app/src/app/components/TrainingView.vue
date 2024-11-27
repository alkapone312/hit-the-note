<template>
    <div class="game-container">
        <div class="metadata">
            <VGameMetadata
                :metadata="noteTrack.getMetadata()"
                @close="() => {$emit('close');close()}"
            />
        </div>
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
            ref="media-player"
            v-if="file !== null"
            :file="file"
            v-model="time"
            @play="play"
            @pause="pause"
            class="media-player"
            ></MediaPlayer>
            <MediaPlayerControls
                @play="play"
                @pause="pause"
                @forward="forward"
                @rewind="rewind"
                @to-start="toStart"
                @to-stop="toStop"
                v-else
            >
            </MediaPlayerControls>
            <div class="note-scale-controls">
                <VCheckbox v-model="pinToDot">Snap to point</VCheckbox>
                <VCheckbox v-model="playNotes">Play notes</VCheckbox>
                <VButton class="control-button" @click="toneDown">Tone Down</VButton>
                <span class="current-tone">{{ currentTone }}</span>
                <VButton class="control-button" @click="toneUp">Tone up</VButton>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import NoteScale from './NoteScale.vue';
import { inject, ref, defineProps, watch, useTemplateRef } from 'vue';
import MediaPlayer from './MediaPlayer.vue';
import CurrentNoteInfo from './CurrentNoteInfo.vue'
import VCheckbox from './shared/VCheckbox.vue';
import { NoteFactory, NoteTrack, PitchDetectionPipeline, PitchDetectionPipelineFactory, SettingsLoader } from '../../main.js'
import VButton from './shared/VButton.vue';
import MediaPlayerControls from './MediaPlayerControls.vue';
import VGameMetadata from './VGameMetadata.vue';
import OscillatorController from '@App/utils/OscillatorController';

const pinToDot = ref(true);
const playNotes = ref(false);
const isPlaying = ref(false);
const currentTone = ref(0);
const time = ref(0);
const frequency = ref(0);
const note = ref('C0');
const expectedNote = ref('C0');
const expectedFrequency = ref(0);
let pitchRecognition: PitchDetectionPipeline | null = null;
(async () => {
    pitchRecognition = await inject<PitchDetectionPipelineFactory>("pitchDetectionFactory")?.createFromLoader(inject<SettingsLoader>('settingsLoader')!) ?? null;
    pitchRecognition?.onPitchDetected((pitch) => {
        frequency.value = pitch;
        note.value = noteFactory!.createClosestNoteForFrequency(pitch).getName();
    });
})()
const noteFactory = inject<NoteFactory>('noteFactory');
const { noteTrack } = defineProps<{noteTrack: NoteTrack}>();
let timeInterval: unknown;
const oscillator = new OscillatorController();
watch([time, playNotes, isPlaying], ([newTime]) => {
    const note = noteTrack.getNote(newTime);
    if(!note || !playNotes.value || !isPlaying.value) {
        oscillator.stop();
        return;
    }
    
    oscillator.start(note.getNote().getFrequency());
});

watch(time, (newTime: number) => {
    const note = noteTrack.getNote(newTime);
    if(note == null) return;
    expectedNote.value = note.getNote().getName();
    expectedFrequency.value = note.getNote().getFrequency();
});

const file = noteTrack.getSoundtrack();

function play() {
    isPlaying.value = true;
    pitchRecognition?.startDetection();
    if(!file) {
        lastTime = new Date().getTime()!;
        measureTime()
    }
}

function pause() {
    isPlaying.value = false;
    pitchRecognition?.stopDetection();
    if(!file) {
        lastTime = new Date().getTime()!;
        stopTimeMeasure()
    }
}

function forward() {
    time.value += 1
}

function rewind() {
    time.value -= 1
}

function toStart() {
    time.value = 0
}

function toStop() {
    time.value = noteTrack.getNotes()[noteTrack.getNotes().length].getEndTime();
}

let lastTime = new Date().getTime()!;
function measureTime() {
    timeInterval = setInterval(() => {
        const thisTime = new Date().getTime()!;
        time.value! += (thisTime - lastTime) / 1000
        lastTime = thisTime;
    }, 1000/30);
}

function stopTimeMeasure() {
    clearInterval(timeInterval as number);
}

function toneUp() {
    currentTone.value += 1;
    noteTrack.changeTone(1);
}

function toneDown() {
    currentTone.value -= 1;
    noteTrack.changeTone(-1);
}

function close() {
    console.log(useTemplateRef('media-player').value);
    pause();
    oscillator.stop();
}

</script>

<style scoped>
    .metadata {
        background-color: white;
        border: 5px solid rgb(255, 216, 100);
        outline: 5px solid white;
        border-radius: 20px;
        margin: 30px 30px 0 30px;
    }

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