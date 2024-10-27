<template>
    <MediaPlayerControls
    @to-start="resetToStart()"
    @rewind="rewind10Seconds()"  
    @play="play()"
    @pause="pause()"
    @forward="forward10Seconds()"
    @to-stop="skipToEnd()"
    />
  </template>
  
  <script setup lang="ts">
  import MediaPlayerFactory from '@/note/MediaPlayerFactory';
  import { ref, defineProps, defineModel, inject } from 'vue';
  import MediaPlayerControls from './MediaPlayerControls.vue';
  
  const {file} = defineProps<{file: File}>()
  const mediaPlayer = inject<MediaPlayerFactory>('mediaPlayerFactory')!.createForFile(file);
  const isPlaying = ref(false);
  const currentTime = defineModel<number>();
  currentTime.value = 0;
  let lastTime = new Date().getTime()!;
  let timeInterval: unknown;

  const emit = defineEmits(['play', 'pause'])

  function play() {
    lastTime = new Date().getTime()!;
    mediaPlayer.play();
    isPlaying.value = true;
    setCurrentTime(mediaPlayer.getCurrentTime())
    measureTime();
    emit('play')
  }

  function pause() {
    mediaPlayer.stop();
    isPlaying.value = false;
    setCurrentTime(mediaPlayer.getCurrentTime())
    stopTimeMeasure();
    emit('pause')
  }

  function measureTime() {
    timeInterval = setInterval(() => {
        const thisTime = new Date().getTime()!;
        currentTime.value! += (thisTime - lastTime) / 1000
        lastTime = thisTime;
    }, 1000/30);
  }

  function stopTimeMeasure() {
    clearInterval(timeInterval as number);
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
  </style>
  