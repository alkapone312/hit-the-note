<template>
    <div class="browser-settings">
      <h1>Settings</h1>
      <!-- Sample Rate -->
      <div class="setting">
        <VSelect
          label="Sample Rate"
          :options="sampleRates.map(rate => ({ value: rate, label: rate.toString() }))"
          v-model="selectedSampleRate"
        />
      </div>
  
      <!-- Sample Size -->
      <div class="setting">
        <VSelect
          label="Sample Size"
          :options="sampleSizes.map(size => ({ value: size, label: size.toString() }))"
          v-model="selectedSampleSize"
        />
      </div>
  
      <!-- Channel Count -->
      <div class="setting">
        <VSelect
          label="Channel Count"
          :options="channelCounts.map(count => ({ value: count, label: count.toString() }))"
          v-model="selectedChannelCount"
        />
      </div>
  
      <!-- Window Size -->
      <div class="setting">
        <VSelect
          label="Window Size"
          :options="windowSizes.map(size => ({ value: size, label: size.toString() }))"
          v-model="selectedWindowSize"
        />
      </div>
  
      <!-- Apply Settings -->
      <VButton @click="applySettings">Apply Settings</VButton>
      <VButton @click="$emit('close')">Close</VButton>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import VSelect from './shared/VSelect.vue';
import VButton from './shared/VButton.vue';
  
  // Sample data for settings
  const sampleRates = [44100, 48000];
  const sampleSizes = [8, 16, 24];
  const channelCounts = [1, 2];
  const windowSizes = [256, 512, 1024];
  
  // Reactive state for selected options
  const selectedSampleRate = ref(sampleRates[0]);
  const selectedSampleSize = ref(sampleSizes[0]);
  const selectedChannelCount = ref(channelCounts[0]);
  const selectedWindowSize = ref(windowSizes[0]);
  
  const applySettings = () => {
    const settings = {
      sampleRate: selectedSampleRate.value,
      sampleSize: selectedSampleSize.value,
      channelCount: selectedChannelCount.value,
      windowSize: selectedWindowSize.value,
    };
    console.log('Settings applied:', settings);
  };
  </script>
  
  <style>
  .browser-settings {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    max-width: 400px;
    margin: auto;
    background-color: #899cf4;
    border-radius: 20px;
    outline: 5px solid #c9d3ff;
  }
  
  .setting {
    margin-bottom: 15px;
  }
  </style>
  