import './assets/main.css';

import {createApp} from 'vue';
import {createPinia} from 'pinia';
import App from './App.vue';
import type {MediaPlayerFactory, MediaPlayerInterface, SettingsLoader} from '../main.js';
import {BrowserWavMediaPlayer, PitchDetectionPipeline, BrowserSettingsLoader, NoteFactory, PitchDetectionPipelineFactory} from '../main.js';

// pitch recognition service
(async(): Promise<void> => {    
    const app = createApp(App);
    app.use(createPinia());
    const settingsLoader = new BrowserSettingsLoader()
    app.provide<PitchDetectionPipelineFactory>('pitchDetectionFactory', new PitchDetectionPipelineFactory());
    app.provide<SettingsLoader>('settingsLoader', settingsLoader)
    app.provide<NoteFactory>('noteFactory', new NoteFactory());
    app.provide<MediaPlayerFactory>('mediaPlayerFactory', new class implements MediaPlayerFactory {
        public createForFile(file: File): MediaPlayerInterface {
            if ([ 
                'audio/vnd.wav', 'audio/vnd.wave', 'audio/wave', 
                'audio/x-pn-wav', 'audio/x-wav', 'audio/wav',
                'audio/mpeg'
            ].includes(file.type)) {
                const player = new BrowserWavMediaPlayer(file);
                settingsLoader.load().then(settings => player.setSettings(settings));
                
                return player;
            }
    
            throw new Error('Unsupported file type');
        }

    });

    app.mount('#app');
})();