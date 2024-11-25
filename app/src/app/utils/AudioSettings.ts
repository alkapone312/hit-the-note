import { Settings } from "@/audio/Settings.js";
import { PitchRecognition, SettingsLoader, StreamNode } from "../../main.js";

class AudioSettings implements SettingsLoader {
    private settings: Settings

    public constructor(defaultSettings: Settings) {
        this.settings = defaultSettings;
    }
    
    load(): Promise<Settings> {
        this.settings.recorder.reset()
        this.settings.filterChain.forEach(i => i.reset())
        this.settings.pitchRecognition.reset()
        return Promise.resolve(this.settings)
    }

    public setSampleRate(sampleRate: number) {
        this.settings.sampleRate = sampleRate;
    }

    public setWindowSize(windowSize: number) {
        this.settings.windowSize = windowSize;
    }

    public addFilter(filter: StreamNode) {
        this.settings.filterChain.push(filter);
    }

    public removeFilter(filter: StreamNode) {
        this.settings.filterChain = this.settings.filterChain.filter(f => f !== filter);
    }

    public getFilters(): StreamNode[] {
        return this.settings.filterChain;
    }

    public setRecognition(recognition: PitchRecognition) {
        this.settings.pitchRecognition = recognition;
    }

    public getSettings() {
        return this.settings;
    }
}

export default AudioSettings;