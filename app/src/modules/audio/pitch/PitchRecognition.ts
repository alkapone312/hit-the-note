import StreamNode from '../StreamNode.js';

type PitchDetectedCallback = (frequency: number) => void;

/**
 * Abstract class for pitch recognition algorithms.
 */
abstract class PitchRecognition extends StreamNode {

    /**
     * List of callbacks
     */
    protected callbacks: PitchDetectedCallback[] = [];
    
    /**
     * Register callback that will be invoked when algorithm has detected pitch. 
     */
    public onPitchDetected(callback: PitchDetectedCallback): void {
        this.callbacks.push(callback);
    }
    
    /**
     * Helper method to broadcast detected pitch to all subscribers.
     */
    protected pitchDetected(pitch: number): void {
        this.callbacks.forEach(cb => {
            cb(pitch); 
        });
    }
}

export default PitchRecognition;
export type {PitchDetectedCallback};