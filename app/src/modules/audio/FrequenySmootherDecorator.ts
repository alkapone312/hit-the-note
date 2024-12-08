import PitchRecognition from './pitch/PitchRecognition.js';
import type {PipelineSettings} from './Settings.js';

/**
 * Smooths out the recognized pitch signal by buffering couple
 * of values and filtering out big peaks in signal. Filtering happens
 * by performing median operation.
 */
class FrequencySmootherDecorator extends PitchRecognition {
    private readonly buffer: number[] = [];
  
    public constructor(
        private readonly recognition: PitchRecognition,
        private readonly bufferSize = 10
    ) {
        super();
        this.recognition.onPitchDetected((freq) => {
            this.pitchDetected(this.smoothFrequency(freq)); 
        });
    }

    public accept(data: Float32Array): void {
        this.recognition.accept(data);
    }    
    
    public setSettings(settings: PipelineSettings): void {
        this.recognition.setSettings(settings);
        super.setSettings(settings);
    }

    private smoothFrequency(newFrequency: number): number {
        this.buffer.push(newFrequency);

        if (this.buffer.length > this.bufferSize) {
            this.buffer.shift();
        }

        const smoothedFrequency = this.median(this.buffer);
    
        return smoothedFrequency;
    }

    private median(data: number[]): number {
        const sortedData = [...data].sort((a, b) => a - b);
        const mid = Math.floor(sortedData.length / 2);

        if (sortedData.length % 2 === 0) {
            return (sortedData[mid - 1] + sortedData[mid]) / 2;
        } else {
            return sortedData[mid];
        }
    }
}

export default FrequencySmootherDecorator;