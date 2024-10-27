<template>
    <div class="media-player">
      <div class="controls">
        <VButton class="media-player-button" @click="resetToStart"><MediaPlayerStart/></VButton>
        <VButton class="media-player-button" @click="rewind10Seconds"><MediaPlayerPrevious/></VButton>
        <VButton class="media-player-button" @click="togglePlay"><MediaPlayerPause v-if="isPlaying"/><MediaPlayerPlay v-else/></VButton>
        <VButton class="media-player-button" @click="forward10Seconds"><MediaPlayerNext/></VButton>
        <VButton class="media-player-button" @click="skipToEnd"><MediaPlayerEnd/></VButton>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import MediaPlayerFactory from '@/note/MediaPlayerFactory';
  import MediaPlayerStart from './icons/MediaPlayerStart.vue';
  import MediaPlayerPrevious from './icons/MediaPlayerPrevious.vue';
  import MediaPlayerPause from './icons/MediaPlayerPause.vue';
  import MediaPlayerPlay from './icons/MediaPlayerPlay.vue';
  import MediaPlayerNext from './icons/MediaPlayerNext.vue';
  import MediaPlayerEnd from './icons/MediaPlayerEnd.vue';
  import { ref, defineProps, defineModel, inject } from 'vue';
  import VButton from './shared/VButton.vue';
  const {file} = defineProps<{file: File}>()
  const mediaPlayer = inject<MediaPlayerFactory>('mediaPlayerFactory')!.createForFile(file);
  const isPlaying = ref(false);
  const currentTime = defineModel<number>();
  currentTime.value = 0;
  let lastTime = new Date().getTime()!;
  let timeInterval: any;

  const emit = defineEmits(['play', 'pause'])
  
  function togglePlay() {
    if (isPlaying.value) {
        mediaPlayer.stop();
        isPlaying.value = false;
        setCurrentTime(mediaPlayer.getCurrentTime())
        stopTimeMeasure();
        emit('pause')
    } else {
        lastTime = new Date().getTime()!;
        mediaPlayer.play();
        isPlaying.value = true;
        setCurrentTime(mediaPlayer.getCurrentTime())
        measureTime();
        emit('play')
    }
  }

  function measureTime() {
    timeInterval = setInterval(() => {
        const thisTime = new Date().getTime()!;
        currentTime.value! += (thisTime - lastTime) / 1000
        lastTime = thisTime;
    }, 1000/30);
  }

  function stopTimeMeasure() {
    clearInterval(timeInterval);
  }

  function resetToStart() {
    mediaPlayer.setCurrentTime(0);
    setCurrentTime(mediaPlayer.getCurrentTime());
  }
  
  function rewind10Seconds() {
    mediaPlayer.setCurrentTime(mediaPlayer.getCurrentTime() - 10);
    setCurrentTime(mediaPlayer.getCurrentTime());
  }
  
  function forward10Seconds() {
    mediaPlayer.setCurrentTime(mediaPlayer.getCurrentTime() + 10);
    setCurrentTime(mediaPlayer.getCurrentTime());
  }
  
  function skipToEnd() {
    mediaPlayer.setCurrentTime(mediaPlayer.getTimeLength());
    setCurrentTime(mediaPlayer.getCurrentTime());
  }

  function setCurrentTime(time: number) {
    currentTime.value = time;
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

  svg {
    width: 3rem;
    height: 3rem;
    fill: white;;
  }
  </style>
  