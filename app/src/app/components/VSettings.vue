<template>
  <div class="browser-settings">
    <h1>Settings</h1>
    <FormComponent 
      :settings="settings"
      @change="settingsChanged"
    />
    <VPopup class="popup" v-if="shouldPopup">
      <FormComponent
        :settings="popupSettings"
        @change="popupSettingsChanged"
      />
      <div class="popup-buttons">
        <VButton @click="() => {shouldPopup = false;}">OK</VButton>
      </div>
    </VPopup>
    <VButton @click="() => {applySettings();$emit('close')}">Close</VButton>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue';
import VButton from './shared/VButton.vue';
import AudioSettings from '@App/utils/AudioSettings';
import { FrequencySmootherDecorator, AmplitudeThresholdFilter, HammingWindowNode, HighPassFilter, MovingAverageFilter, ACFRecognition, ACFAndAMDFPitchRecognition, AMDFPitchRecognition, FFTPitchRecognition, HPSPitchRecognition, CBHPSPitchRecognition, ZeroCrossingRecognition, MediaRecorderAudioStream } from '../../main';
import VPopup from './VPopup.vue';
import FormComponent from './shared/FormComponent.vue';
import { SettingsArray } from './shared/FormTypes';

const popupSettings: SettingsArray = [];
const shouldPopup = ref(false);
const audioSettings = inject<AudioSettings>('settingsLoader');

const pitchMap = [
  ZeroCrossingRecognition,
  AMDFPitchRecognition,
  ACFRecognition,
  ACFAndAMDFPitchRecognition,
  HPSPitchRecognition,
  CBHPSPitchRecognition,
  FFTPitchRecognition
];

const filterMap = [
  AmplitudeThresholdFilter,
  HighPassFilter,
  MovingAverageFilter,
  HammingWindowNode
]

const settings: SettingsArray = [
  {
    name: "Sample Rate",
    label: "sample_rate",
    type: "select",
    default: audioSettings.getSettings().sampleRate,
    values: [{value: audioSettings.getSettings().sampleRate, name: audioSettings.getSettings().sampleRate}],
  },
  {
    name: "Window Size",
    label: "window_size",
    type: "select",
    default: audioSettings.getSettings().windowSize,
    values: [
      {value: 32, name: "32"}, 
      {value: 64, name: "64"}, 
      {value: 128, name: "128"}, 
      {value: 256, name: "256"}, 
      {value: 512, name: "512"}, 
      {value: 1024, name: "1024"}, 
      {value: 2048, name: "2048"}, 
      {value: 4096, name: "4096"}, 
      {value: 8192, name: "8192"}, 
      {value: 16384, name: "16384"}, 
      {value: 32768, name: "32768"}
    ]
  },
  {
    name: "Filters Pipeline",
    label: "filters_pipeline",
    type: "list",
    default: audioSettings.getFilters().map(translateFilterClassTypeToId),
    values: [
      {value: 0, name: "Amplitude threshold"}, 
      {value: 1, name: "High pass filter"}, 
      {value: 2, name: "Moving average"},
      {value: 3, name: "Hamming window"}, 
    ]
  },
  {
    name: "Pitch Recognition",
    label: "pitch_recognition",
    type: "select",
    default: translatePitchClassTypeToId(audioSettings.getSettings().pitchRecognition.recognition),
    values: [
      {value: 0, name: "Zero crossings"},
      {value: 1, name: "AMDF"},
      {value: 2, name: "ACF"},
      {value: 3, name: "ACF & AMDF"},
      {value: 4, name: "HPS"},
      {value: 5, name: "CBHPS"},
      {value: 6, name: "FFT"},
    ]
  }
]

// TODO: Allow single filter settings manipulation
// const amplitudeThresholdSettings: NumberOptions = {
//   name: "Threshold",
//   label: "threshold",
//   type: "number",
//   range: [0,1],
//   step: 0.01,
//   default: 0.025,
// }

// const highPassFilterSettings: NumberOptions = {
//   name: "Cut-off frequency",
//   label: "cutoff_frequency",
//   type: "number",
//   range: [500, 900],
//   step: 1,
//   default: 900,
// }

// const movingAverageSettings: NumberOptions = {
//   name: "Moving average",
//   label: "moving_average",
//   type: "number",
//   step: 1,
//   default: 500
// }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let currentSettings: any = null;
function settingsChanged(settings: Record<string, unknown>) {
  currentSettings = settings;
}

function translateFilterClassTypeToId(c) {
  return filterMap.findIndex(v => v == c.constructor)
}

function translatePitchClassTypeToId(c) {
  return pitchMap.findIndex(v => v == c.constructor)
}

function applySettings() {
  if(currentSettings == null) {
    return;
  }
  audioSettings.getFilters().forEach(element => {
    audioSettings.removeFilter(element);
  });

  // TODO: allow to turn off smoother
  audioSettings.setRecognition(new FrequencySmootherDecorator(new pitchMap[currentSettings.pitch_recognition]()))
  currentSettings.filters_pipeline.forEach((index) => {
    audioSettings.addFilter(new filterMap[index]())
  })
  audioSettings.getSettings().recorder = new MediaRecorderAudioStream(10)
  audioSettings.setSampleRate(currentSettings.sample_rate)
  audioSettings.setWindowSize(currentSettings.window_size)
}
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
  max-height: 80%;
  overflow: scroll;
}

.popup {
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 20px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #899cf4;
  color: white;
}

.popup-buttons {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  background-color: #899cf4;
  color: white;
}
</style>
