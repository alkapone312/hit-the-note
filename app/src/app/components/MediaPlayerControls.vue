<template>
    <div class="media-player">
      <div class="controls">
        <VButton class="media-player-button" @click="$emit('toStart')"><MediaPlayerStart/></VButton>
        <VButton class="media-player-button" @click="$emit('rewind')"><MediaPlayerPrevious/></VButton>
        <VButton class="media-player-button" @click="togglePlay()"><MediaPlayerPause v-if="isPlaying"/><MediaPlayerPlay v-else/></VButton>
        <VButton class="media-player-button" @click="$emit('forward')"><MediaPlayerNext/></VButton>
        <VButton class="media-player-button" @click="$emit('toStop')"><MediaPlayerEnd/></VButton>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import MediaPlayerStart from './icons/MediaPlayerStart.vue';
  import MediaPlayerPrevious from './icons/MediaPlayerPrevious.vue';
  import MediaPlayerPause from './icons/MediaPlayerPause.vue';
  import MediaPlayerPlay from './icons/MediaPlayerPlay.vue';
  import MediaPlayerNext from './icons/MediaPlayerNext.vue';
  import MediaPlayerEnd from './icons/MediaPlayerEnd.vue';
  import VButton from './shared/VButton.vue';

  const isPlaying = ref(false);
  const emit = defineEmits(['play', 'pause', 'toStart', 'rewind', 'forward', 'toStop'])

  function togglePlay() {
    if (isPlaying.value) {
        isPlaying.value = false;
        emit('pause')
    } else {
        isPlaying.value = true;
        emit('play')
    }
  }
  </script>
  
  <style scoped>
  .media-player {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .controls {
    display: flex;
    gap: 20px;
  }

  .media-player-button {
    display: flex;
    align-items: center;
  }
  </style>
  