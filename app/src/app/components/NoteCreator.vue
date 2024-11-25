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
                    :current-frequency="frequency"
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
                <VButton @click="closePopup" style="align-self: baseline;"><VClose/></VButton>
                <div class="settings-inputs">
                    Track name:
                    <VInput class="settings-input" type="text" :value="trackName" @change="trackNameChange"/>
                    Artist:
                    <VInput class="settings-input" type="text" :value="artist" @change="artistChange"/>
                </div>
                <VCheckbox v-model="playSoundtrack">Play soundtrack</VCheckbox>
                <VCheckbox v-model="playHelperTrack">Play helper track</VCheckbox>
                <div class="shift-change">
                    <VButton @click="shiftMinus"><VLeft/></VButton>
                    <div style="display: flex; flex-direction: column;">
                        Shift change
                        <VInput type="text" :value="shiftChange.toFixed(1)" readonly></VInput>
                    </div>
                    <VButton @click="shiftPlus"><VRight/></VButton>
                </div>
                <div class="shift-change">
                    <VButton @click="helperShiftMinus"><VLeft/></VButton>
                    <div style="display: flex; flex-direction: column;">
                        Helper track <br> shift change
                        <VInput type="text" :value="helperShiftChange.toFixed(1)" readonly></VInput>
                    </div>
                    <VButton @click="helperShiftPlus"><VRight/></VButton>
                </div>
                <VButton @click="loadSoundTrack">Load soundtrack</VButton>
                <VButton @click="loadHelperTrack">Load helper track</VButton>
                <VButton @click="importTrack">Import</VButton>
                <VButton @click="exportTrack">Export</VButton>
            </VPopup>
            <VButton class="close-button" @click="$emit('close')"><VClose/></VButton>
    </div>
</template>

<script setup lang="ts">
import NoteScale from './NoteScale.vue';
import { ref, onMounted, onUnmounted, inject, watch, computed, useTemplateRef, Ref, toRaw } from 'vue';
import VClose from './icons/VClose.vue';
import VCheckbox from './shared/VCheckbox.vue';
import { MediaPlayerFactory, MediaPlayerInterface, NoteFactory, NoteInTime, NoteTrack, NoteTrackExporter, NoteTrackImporter, PitchDetectionPipeline, PitchDetectionPipelineFactory, RecordingInterface, SettingsLoader, StreamNode } from '../../main.js'
import VButton from './shared/VButton.vue';
import MediaPlayerControls from './MediaPlayerControls.vue';
import VMore from './icons/VMore.vue';
import OscillatorController from '@App/utils/OscillatorController';
import NoteEditor from './NoteEditor.vue';
import VPopup from './VPopup.vue';
import VLeft from './icons/VLeft.vue';
import VRight from './icons/VRight.vue';
import VInput from './shared/VInput.vue';
import NoteTrackMetadata from '@/note/NoteTrackMetadata';

const noteScale = useTemplateRef('note-scale')
const trackName = ref('Track')
const artist = ref('Artist')
const pinToDot = ref(true);
const playSoundtrack = ref(true);
const playHelperTrack = ref(true);
const playNotes = ref(true);
const isPopupOpen = ref(false);
const time = ref(0);
const frequency = ref(0);
const recomputeNotes = ref(0);
const shiftChange = ref(0);
const helperShiftChange = ref(0);
const mediaPlayerFactory = inject<MediaPlayerFactory>('mediaPlayerFactory');
let pitchRecognition: PitchDetectionPipeline | null = null;
const pitchRecognitionFactory = inject<PitchDetectionPipelineFactory>("pitchDetectionFactory");
const settingsLoader = inject<SettingsLoader>('settingsLoader'); 
const noteFactory = inject<NoteFactory>('noteFactory')!;
let noteTrack = new NoteTrack([], new NoteTrackMetadata(trackName.value, artist.value, 'name.htn'));
let soundTrackPlayer: MediaPlayerInterface | null = null;
let helperTrackMediaPlayer: MediaPlayerInterface | null = null;
const notes = computed(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const tmp = recomputeNotes.value;
    return noteTrack.getNotes();
})
loadPitchRecognition()
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

function trackNameChange(event: Event) {
    trackName.value = (event.target as HTMLInputElement).value;
    noteTrack.getMetadata().setName(trackName.value);
}

function artistChange(event: Event) {
    artist.value = (event.target as HTMLInputElement).value;
    noteTrack.getMetadata().setArtist(artist.value);
}

function toStart() {
    time.value = 0;
    soundTrackPlayer?.setCurrentTime(time.value + noteTrack.getSoundTrackShift())
    helperTrackMediaPlayer?.setCurrentTime(time.value + helperShiftChange.value)
}

function forward() {
    time.value += 1
    soundTrackPlayer?.setCurrentTime(time.value + noteTrack.getSoundTrackShift())
    helperTrackMediaPlayer?.setCurrentTime(time.value + helperShiftChange.value)
}

function rewind() {
    time.value = Math.max(time.value - 1, 0)
    soundTrackPlayer?.setCurrentTime(time.value + noteTrack.getSoundTrackShift())
    helperTrackMediaPlayer?.setCurrentTime(time.value + helperShiftChange.value)
}

function play() {
    soundTrackPlayer?.setCurrentTime(time.value + noteTrack.getSoundTrackShift())
    helperTrackMediaPlayer?.setCurrentTime(time.value + helperShiftChange.value)
    isPlaying = true;
    if(playSoundtrack.value) {
        soundTrackPlayer?.play()
    }
    if(playHelperTrack.value) {
        pitchRecognition?.startDetection();
        helperTrackMediaPlayer?.play()
    }
}

function pause() {
    pitchRecognition?.stopDetection();
    isPlaying = false;
    oscillator.stop();
    soundTrackPlayer?.stop()
    helperTrackMediaPlayer?.stop()
}

function shiftMinus() {
    shiftChange.value -= 0.1;
    noteTrack.setSoundTrackShift(shiftChange.value)
}

function shiftPlus() {
    shiftChange.value += 0.1;
    noteTrack.setSoundTrackShift(shiftChange.value)
}

function helperShiftMinus() {
    helperShiftChange.value -= 0.1;
    noteTrack.setSoundTrackShift(shiftChange.value)
}

function helperShiftPlus() {
    helperShiftChange.value += 0.1;
    noteTrack.setSoundTrackShift(shiftChange.value)
}

function addNote(event: MouseEvent, time: number, frequency: number) {
    try {
        const note = noteFactory.createClosestNoteInTimeForFrequency(frequency, time, time + 0.3);
        noteTrack.addNote(note)
        if(editingNote.value) {
            editingNote.value = note;
        }

        refresh();
    } catch(e) {
        console.error(e)
    }
}

function loadHelperTrack() {
    loadMedia().then(player => {
        helperTrackMediaPlayer = player
        loadPitchRecognition()
    }).catch(e => console.error(e));
}

function loadSoundTrack() {
    loadMedia().then(player => {
        soundTrackPlayer = player
        noteTrack.setSoundtrack(player.getFile())
    }
    ).catch(e => console.error(e));
}

function loadMedia(): Promise<MediaPlayerInterface> {
    return new Promise((resolve, reject) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".mp3,.wav";

        input.onchange = (event: Event) => {
            const target = event.target as HTMLInputElement;
            const file = target.files![0]
            if(!file) {
                reject("No file")
            }
            resolve(mediaPlayerFactory!.createForFile(file));
        }

        input.click();
    })
}

async function loadPitchRecognition(): Promise<void> {
    if(helperTrackMediaPlayer) {
        pitchRecognition = await pitchRecognitionFactory?.createFromLoaderWithDifferentRecorder(settingsLoader!, (helperTrackMediaPlayer as unknown as RecordingInterface & StreamNode)) ?? null;
    } else {
        pitchRecognition = await pitchRecognitionFactory?.createFromLoader(settingsLoader!) ?? null;
    }
    pitchRecognition?.onPitchDetected((pitch) => {
        frequency.value = pitch
    });
}

function importTrack(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.htn';
    const sc = shiftChange;
    input.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) {
            return;
        }

        try {
            const noteTrackImporter = new NoteTrackImporter();
            noteTrack = await noteTrackImporter.import(file);
            const soundTrack = noteTrack.getSoundtrack();
            sc.value = noteTrack.getSoundTrackShift();
            if(soundTrack) {
                soundTrackPlayer = mediaPlayerFactory!.createForFile(soundTrack);
            } else {
                soundTrackPlayer = null;
            }
            trackName.value = noteTrack.getMetadata().getName();
            artist.value = noteTrack.getMetadata().getArtist();
            refresh()
            recomputeNotes.value++;
        } catch (error) {
            console.error('Failed to import NoteTrack:', error);
        }
    };

    input.click();
}

async function exportTrack(): Promise<void> {
    const exporter = new NoteTrackExporter();
    const zipFile = await exporter.export(noteTrack);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(zipFile);
    a.download = noteTrack.getMetadata().getFilename();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function refresh() {
    noteScale.value?.$forceUpdate()
}

let isPlaying: boolean = false;
let interval;
onMounted(() => {
    let lastTime = new Date().getTime();
    interval = setInterval(() => {
        const thisTime = new Date().getTime();
        if(!isPlaying) {
            lastTime = thisTime;
            return;
        }
        if(time.value < 0) {
            time.value = 0;
        }
        time.value += (thisTime - lastTime) / 1000
        lastTime = thisTime;
    }, 1000/30)
})

onUnmounted(() => {
    clearInterval(interval);
    oscillator.stop()
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
        justify-content: flex-start;
        position: absolute;
        left: 50%;
        top: 50%;
        gap: 30px;
        transform: translate(-50%, -50%);
        background-color: #899cf4;
        max-height: 60%;
        overflow: scroll;
    }

    .more-popup button {
        text-wrap: nowrap;
        font-size: 2rem;
    }

    .shift-change {
        display: flex;
        justify-content: space-around;
        align-items: center;
    }

    .settings-inputs {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .settings-input {
        width: 100%;
        font-size: 2rem;
    }
</style>