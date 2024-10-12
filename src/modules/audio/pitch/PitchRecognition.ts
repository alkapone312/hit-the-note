import StreamNode from '../StreamNode';

type PitchDetectedCallback = (frequency: number) => void;

abstract class PitchRecognition extends StreamNode {
    protected callbacks: PitchDetectedCallback[] = [];
    
    public onPitchDetected(callback: PitchDetectedCallback): void {
        this.callbacks.push(callback);
    }
    
    protected pitchDetected(pitch: number): void {
        this.callbacks.forEach(cb => {
            cb(pitch); 
        });
    }
}

export default PitchRecognition;
export type {PitchDetectedCallback};