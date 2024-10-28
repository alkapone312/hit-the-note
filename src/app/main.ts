import './assets/main.css';

import {createApp} from 'vue';
import {createPinia} from 'pinia';
import App from './App.vue';
import type {MediaPlayerFactory, MediaPlayerInterface} from '../main.js';
import {BrowserWavMediaPlayer, PitchDetectionPipeline, BrowserSettingsLoader, NoteFactory} from '../main.js';

// pitch recognition service
(async(): Promise<void> => {
    const settings = await new BrowserSettingsLoader().load();
    const pitchDetectionPipeline = new PitchDetectionPipeline(settings);
    pitchDetectionPipeline.getRecorder().setUp();
    const app = createApp(App);

    app.use(createPinia());
    app.provide<PitchDetectionPipeline>('pitchRecognition', pitchDetectionPipeline);
    app.provide<NoteFactory>('noteFactory', new NoteFactory());
    app.provide<MediaPlayerFactory>('mediaPlayerFactory', new class implements MediaPlayerFactory {
        public createForFile(file: File): MediaPlayerInterface {
            if ([ 'audio/vnd.wav', 'audio/vnd.wave', 'audio/wave', 'audio/x-pn-wav', 'audio/x-wav', 'audio/wav'].includes(file.type)) {
                return new BrowserWavMediaPlayer(file);
            }
    
            throw new Error('Unsupported file type');
        }

    });

    app.mount('#app');
})();