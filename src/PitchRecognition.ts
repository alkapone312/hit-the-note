import AudioStream from "./AudioStream.js";

type PitchDetectedCallback = (frequency: number) => void;

abstract class PitchRecognition {
    callbacks: PitchDetectedCallback[] = []
    
    protected pitchDetected(pitch: number) {
        this.callbacks.forEach(cb => cb(pitch));
    }

    public onPitchDetected(callback: PitchDetectedCallback) {
        this.callbacks.push(callback)
    }

    public abstract startRecognition(stream: AudioStream): void;

    public abstract stopRecognition(): void;
}

export default PitchRecognition;
export type {PitchDetectedCallback};