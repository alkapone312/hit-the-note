<template>
    <div class="editor-container" @click="$emit('update')">
        <div class="note-part">
            Note:
            <VButton @click="increaseNote"><VUp/></VButton>
            <VInput type="text" @change="noteChange" :value="note.getNote().getName()"></VInput>
            <VButton @click="decreaseNote"><VDown/></VButton>
        </div>
        <div class="time-part">
            Start time:
            <div class="time-settings">
                <VButton @click="decreaseStartTime"><VLeft/></VButton>
                <VInput type="text" @change="startTimeChange" :value="note.getStartTime().toFixed(2)"></VInput>
                <VButton @click="increaseStartTime"><VRight/></VButton>
            </div>
            End time:
            <div class="time-settings">
                <VButton @click="decreaseEndTime"><VLeft/></VButton>
                <VInput type="text" @change="endTimeChange" :value="note.getEndTime().toFixed(2)"></VInput>
                <VButton @click="increaseEndTime"><VRight/></VButton>
            </div>
        </div>
        <div class="utils-part">
            Close:
            <VButton @click="$emit('close')"><VClose/></VButton>
            Delete:
            <VButton @click="$emit('remove', note)" class="danger-button"><VDelete/></VButton>
        </div>
    </div>
</template>

<script setup lang="ts">
    import NoteInTime from '@/note/NoteInTime';
    import { defineProps, inject } from 'vue';
    import VButton from './shared/VButton.vue';
    import VLeft from './icons/VLeft.vue';
    import VRight from './icons/VRight.vue';
    import VUp from './icons/VUp.vue';
    import VDown from './icons/VDown.vue';
    import VDelete from './icons/VDelete.vue';
    import VClose from './icons/VClose.vue';
    import VInput from './shared/VInput.vue';
    import NoteFactory from '@/note/NoteFactory';

    const {note} = defineProps<{
        note: NoteInTime
    }>()
    const noteFactory = inject<NoteFactory>("noteFactory")!;

    function decreaseStartTime() {
        note.setStartTime(note.getStartTime() - 0.1);
    }

    function increaseStartTime() {
        note.setStartTime(note.getStartTime() + 0.1);
    }

    function decreaseEndTime() {
        note.setEndTime(note.getEndTime() - 0.1);    
    }

    function increaseEndTime() {
        note.setEndTime(note.getEndTime() + 0.1);    
    }

    function increaseNote() {
        note.setNote(noteFactory.createNoteInDifferentTone(note.getNote(), 1))
    }

    function decreaseNote() {
        note.setNote(noteFactory.createNoteInDifferentTone(note.getNote(), -1))
    }

    function noteChange(event: InputEvent) {
        const target = event.target as HTMLInputElement;
        note.setNote(noteFactory.createNoteForName(target.value));
    }

    function startTimeChange(event) {
        const target = event.target as HTMLInputElement;
        note.setStartTime(parseFloat(target.value));
    }

    function endTimeChange(event) {
        const target = event.target as HTMLInputElement;
        note.setEndTime(parseFloat(target.value));
    }

</script>

<style scoped>
    .editor-container {
        display: flex;
        width: 500px;
        height: 300px;
    }

    .note-part, .time-part, .utils-part {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        color: lightgrey;
        flex-direction: column;
        gap: 10px;
        font-size: 1.8rem;
    }

    .note-part {
        width: 25%;
    }

    .time-part {
        width: 75%;
    }

    .time-settings {
        width: 100%;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        color: lightgray;
        font-size: 1.8rem;
    }

    button {
        display: flex;
        font-size: 1.5rem;
        padding: 10px;
    }

    .danger-button {
        background-color: red;
        outline-color: red;
    }
</style>