<template>
    <div class="game-container">
        <div class="popup-background" v-if="!started">
        </div>
        <VPopup class="popup" v-if="!countdown && !started">
            <div class="controls">
                <div class="note-scale-controls">
                    <VButton class="control-button" @click="toneDown">Tone Down</VButton>
                    <span class="current-tone">{{ currentTone }}</span>
                    <VButton class="control-button" @click="toneUp">Tone up</VButton>
                </div>
                <VButton @click="start">Start</VButton>
            </div>
        </VPopup>
        <VPopup class="popup" v-if="countdown && !started">
            {{ countdownValue }}
        </VPopup>
        <div class="popup-background" v-if="summary">
        </div>
        <VPopup class="popup" v-if="summary">
            Zdobyte punkty: {{ points.toFixed(0) }}
            <VButton @click="() => {$emit('close');close()}">Zamknij</VButton>
        </VPopup>
        <div class="metadata">
            <VGameMetadata
                :points="points.toFixed(0)"
                :metadata="noteTrack.getMetadata()"
                @close="() => {$emit('close'); close()}"
            />
        </div>
        <div class="note-scale-container">
            <NoteScale
                :snap-to-current-time="true"
                :snap-to-frequency="true"
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
    </div>
</template>

<script setup lang="ts">
import NoteScale from './NoteScale.vue';
import { inject, ref, defineProps, watch } from 'vue';
import CurrentNoteInfo from './CurrentNoteInfo.vue';
import { 
    MediaPlayerFactory, 
    MediaPlayerInterface, 
    NoteFactory, 
    NoteTrack, 
    PitchDetectionPipeline, 
    PitchDetectionPipelineFactory, 
    SettingsLoader,
    NotePoints
} from '../../main.js'
import VButton from './shared/VButton.vue';
import VPopup from './VPopup.vue';
import VGameMetadata from './VGameMetadata.vue';
import Sounds from '@App/Sounds';

const currentTone = ref(0);
const time = ref(0);
const frequency = ref(0);
const note = ref('C0');
const expectedNote = ref('C0');
const expectedFrequency = ref(0);
const points = ref(0);
const summary = ref(false);
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
const notePoints = new NotePoints(noteTrack);

let endTime = 0;
noteTrack.getNotes().forEach(note => {
    if(note.getEndTime() > endTime) {
        endTime = note.getEndTime()
    }
})

watch(time, (newTime: number) => {
    if(time.value > endTime + 3) {
        end();
    }

    const note = noteTrack.getNote(newTime);
    if(note == null) return;
    expectedNote.value = note.getNote().getName();
    expectedFrequency.value = note.getNote().getFrequency();
    notePoints.analyzeAndAddPoints(time.value, frequency.value);
    points.value = notePoints.getTotalPoints()
});

const file = noteTrack.getSoundtrack();
let mediaPlayer: MediaPlayerInterface | null = null;
if(file) {
    mediaPlayer = inject<MediaPlayerFactory>('mediaPlayerFactory')!.createForFile(file);
}

let interval;
let timeout;
const started = ref(false);
const countdown = ref(false);
const countdownValue = ref<string | number>(6);
function start() {
    const countdownFn = () => {
        if(countdownValue.value != 'GO!') {
            (countdownValue.value as number) -= 1;
            if(countdownValue.value == 0) {
                countdownValue.value = 'GO!';
                Sounds.play('longBeep')
            } else {
                Sounds.play('beep')
            }
            setTimeout(countdownFn, 1000)
            return;
        }
        started.value = true;
        mediaPlayer?.play();
        pitchRecognition?.startDetection();
        let lastTime = new Date().getTime();
        interval = setInterval(() => {
            const thisTime = new Date().getTime()
            time.value += (new Date().getTime() - lastTime) / 1000;
            lastTime = thisTime;
        }, 1000/30)
    }
    countdown.value = true;
    countdownFn();
}

function toneUp() {
    currentTone.value += 1;
    noteTrack.changeTone(1);
}

function toneDown() {
    currentTone.value -= 1;
    noteTrack.changeTone(-1);
}

function end() {
    mediaPlayer?.stop()
    pitchRecognition?.stopDetection();
    clearInterval(interval);
    clearTimeout(timeout);
    summary.value = true;
}

function close() {
    mediaPlayer?.stop()
    pitchRecognition?.stopDetection();
    clearInterval(interval);
    clearTimeout(timeout);
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

    .popup-background {
        display: flex;
        position: absolute;
        left: 0;
        top: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 2;
    }

    .popup {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
        font-size: 4rem;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 3;
        background-color: #899cf4;
    }

    .note-scale-container {
        grid-column-start: 2;
        grid-row-start: 1;
        grid-row-end: 3;
    }

    .note-scale {
        box-sizing: content-box;
        border-left: 5px solid rgb(255, 216, 100);
        outline: 5px solid white;
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
    
    .close-button {
        display: flex;
        position: absolute;
        left: 50px; 
        top: 50px;
    }
</style>