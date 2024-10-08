import StreamNode from "../StreamNode";

type PitchDetectedCallback = (frequency: number) => void;

abstract class PitchRecognition extends StreamNode<Float32Array, Float32Array> {
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