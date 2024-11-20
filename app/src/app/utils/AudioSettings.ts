import { Settings } from "@/audio/Settings.js";
import { PitchRecognition, SettingsLoader, StreamNode } from "../../main.js";

class AudioSettings implements SettingsLoader {
    private settings: Settings

    public constructor(defaultSettings: Settings) {
        this.settings = defaultSettings;
    }
    
    load(): Promise<Settings> {
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
        console.log(filter)
        this.settings.filterChain = this.settings.filterChain.filter(f => f !== filter);
    }

    public setRecognition(recognition: PitchRecognition) {
        this.settings.pitchRecognition = recognition;
    }

    public getSettings() {
        return this.settings;
    }
}

export default AudioSettings;