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
        <VButton @click="shouldPopup = false">OK</VButton>
      </div>
    </VPopup>
    <VButton @click="$emit('close')">Close</VButton>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue';
import VButton from './shared/VButton.vue';
import AudioSettings from '@App/utils/AudioSettings';
import { AmplitudeThresholdFilter, HammingWindowNode, HighPassFilter, MovingAverageFilter, ACFRecognition, ACFAndAMDFPitchRecognition, AMDFPitchRecognition, FFTPitchRecognition, HPSPitchRecognition, CBHPSPitchRecognition, ZeroCrossingRecognition } from '../../main';
import VPopup from './VPopup.vue';
import FormComponent from './shared/FormComponent.vue';
import { NumberOptions, SettingsArray } from './shared/FormTypes';

let popupSettings: SettingsArray = [];
const shouldPopup = ref(false);
const audioSettings = inject<AudioSettings>('settingsLoader');
const s = audioSettings?.getSettings();

const settings: SettingsArray = [
  {
    name: "Sample Rate",
    label: "sample_rate",
    type: "select",
    default: 44100,
    values: [{value: 44100, name: "44100"}],
  },
  {
    name: "Window Size",
    label: "window_size",
    type: "select",
    default: 4096,
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
    default: [
      1, 2, 3, 4
    ],
    values: [
      {value: 1, name: "Amplitude threshold"}, 
      {value: 2, name: "High pass filter"}, 
      {value: 3, name: "Moving average"},
      {value: 4, name: "Hamming window"}, 
    ]
  },
  {
    name: "Pitch Recognition",
    label: "pitch_recognition",
    type: "select",
    default: 3,
    values: [
      {value: 1, name: "Zero crossings"},
      {value: 2, name: "AMDF"},
      {value: 3, name: "ACF"},
      {value: 4, name: "ACF & AMDF"},
      {value: 5, name: "HPS"},
      {value: 6, name: "CBHPS"},
      {value: 7, name: "FFT"},
    ]
  }
]

const amplitudeThresholdSettings: NumberOptions = {
  name: "Threshold",
  label: "threshold",
  type: "number",
  range: [0,1],
  step: 0.01,
  default: 0.025,
}

const highPassFilterSettings: NumberOptions = {
  name: "Cut-off frequency",
  label: "cutoff_frequency",
  type: "number",
  range: [500, 900],
  step: 1,
  default: 900,
}

const movingAverageSettings: NumberOptions = {
  name: "Moving average",
  label: "moving_average",
  type: "number",
  step: 1,
  default: 500
}

function popupSettingsChanged() {

}

let lastFilterCount = 4
function settingsChanged(settings) {
  if(settings.filters_pipeline.length > lastFilterCount) {
    const s = tranlateIdToSettings(settings.filters_pipeline.at(-1));
    if(s) {
      popupSettings = [s]
      shouldPopup.value = true;
    }
  }
  lastFilterCount = settings.filters_pipeline.length

  console.log(settings)
}

function tranlateIdToSettings(id): NumberOptions | undefined {
  return [amplitudeThresholdSettings, highPassFilterSettings, movingAverageSettings, ][id - 1]
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
