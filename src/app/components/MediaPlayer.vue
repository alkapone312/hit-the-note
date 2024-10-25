<template>
    <div class="media-player">
      <div class="controls">
        <VButton @click="resetToStart">⏮️ Do zera</VButton>
        <VButton @click="rewind10Seconds">⏪ -10s</VButton>
        <VButton @click="togglePlay">{{ isPlaying ? '⏸️ Stop' : '▶️ Play' }}</VButton>
        <VButton @click="forward10Seconds">⏩ +10s</VButton>
        <VButton @click="skipToEnd">⏭️ Do końca</VButton>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import MediaPlayerFactory from '@/note/MediaPlayerFactory';
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
    margin: 20px 0;
  }
  
  button {
    font-size: 2rem;
  }
  </style>
  