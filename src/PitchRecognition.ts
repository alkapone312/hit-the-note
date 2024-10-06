import AudioStream from "./AudioStream.js";

type PitchDetectedCallback = (frequency: number) => void;

abstract class PitchRecognition extends AudioStream {
    callbacks: PitchDetectedCallback[] = []
    
    public onPitchDetected(callback: PitchDetectedCallback) {
        this.callbacks.push(callback)
    }
    
    protected pitchDetected(pitch: number) {
        this.callbacks.forEach(cb => cb(pitch));
    }
}

export default PitchRecognition;
export type {PitchDetectedCallback};