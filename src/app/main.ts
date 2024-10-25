import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { PitchDetectionPipeline } from '../main.js';
import BrowserSettingsLoader from '@/browser/settings/BrowserSettingsLoader.js';

// pitch recognition service
(async () => {
    const settings = await new BrowserSettingsLoader().load();
    const pitchDetectionPipeline = new PitchDetectionPipeline(settings);
    pitchDetectionPipeline.getRecorder().setUp();
    const app = createApp(App);

    app.use(createPinia());

    app.provide<PitchDetectionPipeline>('pitchRecognition', pitchDetectionPipeline);

    app.mount('#app');
})()
