import './assets/main.css';

import {createApp} from 'vue';
import {createPinia} from 'pinia';
import App from './App.vue';
import { AMDFPitchRecognition, AmplitudeThresholdFilter, HammingWindowNode, HighPassFilter, MovingAverageLowPassFilter, PitchDetectionPipeline, MediaRecorderAudioStream } from '../main.js';

// pitch recognition service
const recorder = new MediaRecorderAudioStream(1000/30);
recorder.setUp()
const pitchDetectionPipeline = new PitchDetectionPipeline({
    sampleRate: 44100,
    sampleSize: 16,
    windowSize: 4096,
    channelCount: 2,
    recorder: recorder,
    filterChain: [
        new AmplitudeThresholdFilter(0.025),
        new HighPassFilter(900),
        new MovingAverageLowPassFilter(500),
        new HammingWindowNode()
    ],
    pitchRecognition: new AMDFPitchRecognition()
});

const app = createApp(App);

app.use(createPinia());

app.provide<PitchDetectionPipeline>('pitchRecognition', pitchDetectionPipeline);

app.mount('#app');
