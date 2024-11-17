<template>
    <div class="note-track">
        <div class="note-track-controls">
            <VButton class="play" @click="$emit('play', metadata)"><MediaPlayerPlay/></VButton>
            <VButton class="train" @click="$emit('training', metadata)"><VTraining/></VButton>
        </div>
        <div class="note-track-metadata">
            <div class="marquee">{{ metadata.getName() }} - {{ metadata.getArtist() }} -&nbsp;</div>
            <div class="marquee">{{ metadata.getName() }} - {{ metadata.getArtist() }} -&nbsp;</div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { defineProps } from 'vue';
    import NoteTrackMetadata from '@/note/NoteTrackMetadata';
    import VButton from './shared/VButton.vue';
    import MediaPlayerPlay from './icons/MediaPlayerPlay.vue';
    import VTraining from './icons/VTraining.vue';
    
    defineProps<{metadata: NoteTrackMetadata}>()
</script>

<style>
.note-track {
    width: 300px;
    height: 250px;
    background-color: white;
    border-radius: 20px;
    border: 5px solid rgb(255, 216, 100);
    outline: 5px solid white;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.note-track-controls {
    height: 60%;
    padding: 10px;
    display: flex;
    gap: 15px;
}

.note-track-metadata {
    overflow: hidden;
    text-wrap: nowrap;
    display: flex;
    width: calc(100% - 10px);
    height: calc(40% - 10px);
    background-color: rgb(255, 216, 100);
    align-self: center;
    border-radius: 20px;
}

.marquee {
  display: flex;
  align-items: center;
  font-size: 2rem;
  animation: scroll 15s linear infinite;
  height: 100%;
}

@keyframes scroll {
  from {
    transform: translateX(0); /* Start from outside the right edge */
  }
  to {
    transform: translateX(-100%); /* Move to outside the left edge */
  }
}


.play, .train {
    display: flex;
    height: 100%;
    justify-content: center;
    border: none !important;   
}

.play svg, .train svg {
    width: 100%;
    height: 100%;
}

.play {
    width: 65%;
}

.train {
    width: 35%;
}

</style>