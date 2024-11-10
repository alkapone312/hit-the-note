<template>
        <div class="creator-container">
                <NoteEditor
                    v-if="editingNote"
                    :note="editingNote"
                    @close="editingNote = null" 
                    @update="refresh"
                    @remove="removeNote"
                    class="note-editor"
                ></NoteEditor>
                <NoteScale
                    :snap-to-current-time="pinToDot"
                    :snap-to-frequency="pinToDot"
                    :notes="notes"
                    :current-time="time"
                    :current-frequency="0"
                    @action="addNote"
                    @note-click="editNote"
                    class="note-scale"
                    ref="note-scale"
                ></NoteScale>
            <div class="controls">
                <MediaPlayerControls
                    @to-start="time = 0"
                    @forward="time += 10"
                    @rewind="time = Math.max(time - 10, 0)"
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
            <VButton class="close-button" @click="$emit('close')"><VClose/></VButton>
    </div>
</template>

<script setup lang="ts">
import NoteScale from './NoteScale.vue';
import { ref, onMounted, onUnmounted, inject, watch, computed, useTemplateRef, Ref, toRaw } from 'vue';
import VClose from './icons/VClose.vue';
import VCheckbox from './shared/VCheckbox.vue';
import { NoteFactory, NoteInTime, NoteTrack } from '../../main.js'
import VButton from './shared/VButton.vue';
import MediaPlayerControls from './MediaPlayerControls.vue';
import OscillatorController from '@App/utils/OscillatorController';
import NoteEditor from './NoteEditor.vue';

const noteScale = useTemplateRef('note-scale')
const pinToDot = ref(true);
const playSoundtrack = ref(true);
const playNotes = ref(true);
const time = ref(0);
const recomputeNotes = ref(0);
const noteFactory = inject<NoteFactory>('noteFactory')!;
const noteTrack = new NoteTrack([]);
let file = ref(noteTrack.getSoundtrack());
const notes = computed(() => {
    const tmp = recomputeNotes.value;
    return noteTrack.getNotes();
})
const editingNote: Ref<NoteInTime | null> = ref(null);

const oscillator = new OscillatorController();
watch([time, playNotes], ([newTime]) => {
    const note = noteTrack.getNote(newTime);
    if(!note || !playNotes.value || !isPlaying) {
        oscillator.stop();
        return;
    }

    oscillator.start(note.getNote().getFrequency());
});

function editNote(note: NoteInTime) {
    editingNote.value = note;
}

function removeNote(note: NoteInTime) {
    noteTrack.removeNote(toRaw(note))
    editingNote.value = null;
    recomputeNotes.value += 1;
}

function play() {
    isPlaying = true;
}

function pause() {
    isPlaying = false;
    oscillator.stop();
}

function addNote(event: MouseEvent, time: number, frequency: number) {
    try {
        noteTrack.addNote(noteFactory.createClosestNoteInTimeForFrequency(frequency, time, time + 1))
        refresh();
    } catch(e) {
    }
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

function refresh() {
    noteScale.value?.$forceUpdate()
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
    .note-editor {
        position: absolute;
        z-index: 2;
    }

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