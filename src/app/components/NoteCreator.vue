<template>
        <div class="creator-container">
                <NoteScale
                    :snap-to-current-time="pinToDot"
                    :snap-to-frequency="pinToDot"
                    :notes="noteTrack.getNotes()"
                    :current-time="time"
                    :current-frequency="frequency"
                    class="note-scale"
                ></NoteScale>
            <div class="controls">
                <MediaPlayerControls
                    @to-start="time = 0"
                    @forward="time += 10"
                    @rewind="time -= 10"
                    @play="play()"
                    @pause="pause()"
                    class="media-player"
                ></MediaPlayerControls>
                <div class="note-scale-controls">
                    <VCheckbox v-model="pinToDot">Snap to point</VCheckbox>
                    <VCheckbox v-model="playNotes">Play notes</VCheckbox>
                    <VCheckbox v-model="playSoundtrack">Play soundtrack</VCheckbox>
                </div>
            </div>
            <VButton class="close-button" @click="$emit('close')"><Close/></VButton>
    </div>
</template>

<script setup lang="ts">
import NoteScale from './NoteScale.vue';
import { ref, onMounted, onUnmounted, inject, watch } from 'vue';
import Close from './icons/Close.vue';
import VCheckbox from './shared/VCheckbox.vue';
import { NoteFactory, NoteTrack } from '../../main.js'
import VButton from './shared/VButton.vue';
import MediaPlayerControls from './MediaPlayerControls.vue';
import OscillatorController from '@App/utils/OscillatorController';

const pinToDot = ref(true);
const playSoundtrack = ref(true);
const playNotes = ref(true);
const time = ref(0);
const noteFactory = inject<NoteFactory>('noteFactory')!;
const noteTrack = new NoteTrack([
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
]);
let file = ref(noteTrack.getSoundtrack());

const oscillator = new OscillatorController();
watch([time, playNotes], ([newTime]) => {
    const note = noteTrack.getNote(newTime);
    if(!note || !playNotes.value || !isPlaying) {
        oscillator.stop();
        return;
    }

    oscillator.start(note.getNote().getFrequency());
});


function play() {
    isPlaying = true;
}

function pause() {
    isPlaying = false;
    oscillator.stop();
}

function loadSoundtrack() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".wav";

    input.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      file.value = target.files![0] ?? null;
    }

    input.click();
}

let isPlaying: boolean = false;
let interval;
onMounted(() => {
    interval = setInterval(() => {
        if(!isPlaying) return;
        if(time.value < 0) {
            time.value = 0;
        }
        time.value += 1/30
    }, 1000/30)
})

onUnmounted(() => {
    clearInterval(interval);
})

</script>

<style scoped>
    .creator-container {
        display: grid;
        grid-template-rows: 75% 25%;
        width: 100%;
        height: 100%;
        align-items: center;
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

    .controls {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 30px;
    }
</style>