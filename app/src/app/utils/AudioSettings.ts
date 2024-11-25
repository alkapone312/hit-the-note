import type {Settings} from '@/audio/Settings.js';
import type {PitchRecognition, SettingsLoader, StreamNode} from '../../main.js';

class AudioSettings implements SettingsLoader {
    private readonly settings: Settings;

    public constructor(defaultSettings: Settings) {
        this.settings = defaultSettings;
    }
    
    public async load(): Promise<Settings> {
        this.settings.recorder.reset();
        this.settings.filterChain.forEach(i => {
            i.reset(); 
        });
        this.settings.pitchRecognition.reset();
        return Promise.resolve(this.settings);
    }

    public setSampleRate(sampleRate: number): void {
        this.settings.sampleRate = sampleRate;
    }

    public setWindowSize(windowSize: number): void {
        this.settings.windowSize = windowSize;
    }

    public addFilter(filter: StreamNode): void {
        this.settings.filterChain.push(filter);
    }

    public removeFilter(filter: StreamNode): void {
        this.settings.filterChain = this.settings.filterChain.filter(f => f !== filter);
    }

    public getFilters(): StreamNode[] {
        return this.settings.filterChain;
    }

    public setRecognition(recognition: PitchRecognition): void {
        this.settings.pitchRecognition = recognition;
    }

    public getSettings(): Settings {
        return this.settings;
    }
}

export default AudioSettings;