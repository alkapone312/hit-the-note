<template>
    <div class="editor-container">
        <div class="note-part">
            Note:
            <VButton><VUp/></VButton>
            {{ note.getNote().getName() }}
            <VButton><VDown/></VButton>
        </div>
        <div class="time-part">
            Start time:
            <div class="time-settings">
                <VButton><VLeft/></VButton>
                {{ note.getStartTime().toFixed(2) }}
                <VButton><VRight/></VButton>
            </div>
            End time:
            <div class="time-settings">
                <VButton><VLeft/></VButton>
                {{ note.getEndTime().toFixed(2) }}
                <VButton><VRight/></VButton>
            </div>
        </div>
        <div class="utils-part">
            Close:
            <VButton @click="$emit('close')"><VClose/></VButton>
            Delete:
            <VButton class="danger-button"><VDelete/></VButton>
        </div>
    </div>
</template>

<script setup lang="ts">
    import NoteInTime from '@/note/NoteInTime';
    import { defineProps } from 'vue';
    import VButton from './shared/VButton.vue';
    import VLeft from './icons/VLeft.vue';
    import VRight from './icons/VRight.vue';
    import VUp from './icons/VUp.vue';
    import VDown from './icons/VDown.vue';
    import VDelete from './icons/VDelete.vue';
    import VClose from './icons/VClose.vue';

    defineProps<{
        note: NoteInTime
    }>()
</script>

<style scoped>
    .editor-container {
        display: flex;
        width: 500px;
        height: 300px;
        padding: 20px;
        border: 5px solid rgb(255, 216, 100);
        border-radius: 20px;
        background-color: white;
        z-index: 1;
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