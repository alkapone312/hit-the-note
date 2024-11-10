<template>
        <div class="creator-container">
                <VPopup v-if="editingNote" class="note-editor">
                    <NoteEditor
                        :note="editingNote"
                        @close="editingNote = null" 
                        @update="refresh"
                        @remove="removeNote"
                    ></NoteEditor>
                </VPopup>
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
                    @to-start="toStart"
                    @forward="forward"
                    @rewind="rewind"
                    @play="play()"
                    @pause="pause()"
                    class="media-player"
                ></MediaPlayerControls>
                <div class="note-scale-controls">
                    <VCheckbox v-model="pinToDot">Snap to point</VCheckbox>
                    <VCheckbox v-model="playNotes">Play notes</VCheckbox>
                    <VButton @click="openPopup"><VMore/></VButton>
                </div>
            </div>
            <VPopup v-if="isPopupOpen" class="more-popup">
                <VButton @click="closePopup"><VClose/></VButton>
                <VButton @click="loadHelperTrack">Load helper track</VButton>
                <VButton @click="loadSoundTrack">Load soundtrack</VButton>

                <VCheckbox v-model="playSoundtrack">Play soundtrack</VCheckbox>
                <VCheckbox v-model="playHelperTrack">Play helper track</VCheckbox>
            </VPopup>
            <VButton class="close-button" @click="$emit('close')"><VClose/></VButton>
    </div>
</template>

<script setup lang="ts">
import NoteScale from './NoteScale.vue';
import { ref, onMounted, onUnmounted, inject, watch, computed, useTemplateRef, Ref, toRaw } from 'vue';
import VClose from './icons/VClose.vue';
import VCheckbox from './shared/VCheckbox.vue';
import { BrowserWavMediaPlayer, MediaPlayerInterface, NoteFactory, NoteInTime, NoteTrack } from '../../main.js'
import VButton from './shared/VButton.vue';
import MediaPlayerControls from './MediaPlayerControls.vue';
import VMore from './icons/VMore.vue';
import OscillatorController from '@App/utils/OscillatorController';
import NoteEditor from './NoteEditor.vue';
import VPopup from './VPopup.vue';

const noteScale = useTemplateRef('note-scale')
const pinToDot = ref(true);
const playSoundtrack = ref(true);
const playHelperTrack = ref(true);
const playNotes = ref(true);
const isPopupOpen = ref(false);
const time = ref(0);
const recomputeNotes = ref(0);
const noteFactory = inject<NoteFactory>('noteFactory')!;
const noteTrack = new NoteTrack([]);
let soundTrackPlayer: MediaPlayerInterface | null = null;
let helperTrackMediaPlayer: MediaPlayerInterface | null = null;
const notes = computed(() => {
    const tmp = recomputeNotes.value;
    return noteTrack.getNotes();
})
const editingNote: Ref<NoteInTime | null> = ref(null);

const oscillator = new OscillatorController();
watch([time, playNotes, playHelperTrack, playSoundtrack], ([newTime]) => {
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

let wasPlayingBeforePopup = false;
function openPopup() {
    wasPlayingBeforePopup = isPlaying;
    isPopupOpen.value = true; 
    pause()
}

function closePopup() {
    isPopupOpen.value = false;
    if(wasPlayingBeforePopup) { 
        play();
    }
}

function toStart() {
    time.value = 0;
    soundTrackPlayer?.setCurrentTime(time.value)
    helperTrackMediaPlayer?.setCurrentTime(time.value)
}

function forward() {
    time.value += 10
    soundTrackPlayer?.setCurrentTime(time.value)
    helperTrackMediaPlayer?.setCurrentTime(time.value)
}

function rewind() {
    time.value = Math.max(time.value - 10, 0)
    soundTrackPlayer?.setCurrentTime(time.value)
    helperTrackMediaPlayer?.setCurrentTime(time.value)
}

function play() {
    soundTrackPlayer?.setCurrentTime(time.value)
    helperTrackMediaPlayer?.setCurrentTime(time.value)
    isPlaying = true;
    if(playSoundtrack.value) {
        soundTrackPlayer?.play()
    }
    if(playHelperTrack.value) {
        helperTrackMediaPlayer?.play()
    }
}

function pause() {
    isPlaying = false;
    oscillator.stop();
    soundTrackPlayer?.stop()
    helperTrackMediaPlayer?.stop()
}

function addNote(event: MouseEvent, time: number, frequency: number) {
    try {
        noteTrack.addNote(noteFactory.createClosestNoteInTimeForFrequency(frequency, time, time + 1))
        refresh();
    } catch(e) {
    }
}

function loadHelperTrack() {
    loadMedia().then(player => helperTrackMediaPlayer = player).catch(e => console.error(e));
}

function loadSoundTrack() {
    loadMedia().then(player => soundTrackPlayer = player).catch(e => console.error(e));
}


function loadMedia(): Promise<MediaPlayerInterface> {
    return new Promise((resolve, reject) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".wav";

        input.onchange = (event: Event) => {
            const target = event.target as HTMLInputElement;
            let file = target.files![0]
            if(!file) {
                reject("No file")
            }
            resolve(new BrowserWavMediaPlayer(file));
        }

        input.click();
    })
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

    .more-popup {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: absolute;
        left: 50%;
        top: 50%;
        gap: 50px;
        transform: translate(-50%, -50%);
        background: url('imgs/background.png');
    }

    .more-popup button {
        text-wrap: nowrap;
        font-size: 2rem;
    }
</style>