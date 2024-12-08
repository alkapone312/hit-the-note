/* eslint-disable @typescript-eslint/prefer-destructuring */
import StreamNode from '../StreamNode.js';

/**
 * Apply a high-pass filter to a signal.
 */
class HighPassFilter extends StreamNode {

    /**
     * @param cutoffFrequency - The cutoff frequency of the high-pass filter (in Hz).
     */
    public constructor(private readonly cutoffFrequency = 50) {
        super();
    }

    /**
     * {@inheritDoc}
     */
    public accept(data: Float32Array): void {
        const outputSignal = new Float32Array(data.length);
    
        // Time step based on sample rate
        const dt = 1 / this.settings.sampleRate;
        
        // Calculate RC and alpha (smoothing factor)
        const RC = 1 / (2 * Math.PI * this.cutoffFrequency);
        const alpha = RC / (RC + dt);
        
        // Initialize the first sample (assume y[-1] = 0)
        outputSignal[0] = data[0];
        
        // Apply the high-pass filter using the difference equation
        for (let n = 1; n < data.length; n++) {
            outputSignal[n] = alpha * (outputSignal[n - 1] + data[n] - data[n - 1]);
        }
        
        this.broadcast(outputSignal);
    }

}

export default HighPassFilter;