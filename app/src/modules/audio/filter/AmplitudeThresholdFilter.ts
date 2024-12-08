import StreamNode from '@/audio/StreamNode.js';


/**
 * Apply amplitude thresholding to filter out low-amplitude noise or silence.
 */
class AmplitudeThresholdFilter extends StreamNode {

    /**
     * @param threshold - Amplitude threshold. Lower values in amplitude will be cut off.
     */
    public constructor(private readonly threshold = 0.025) {
        super();
    }

    /**
     * {@inheritDoc}
     */
    public accept(data: Float32Array): void {
        const outputSignal = new Float32Array(data.length);
    
        for (let i = 0; i < data.length; i++) {
            if (Math.abs(data[i]) >= this.threshold) {
                outputSignal[i] = data[i];
            } else {
                outputSignal[i] = 0;
            }
        }
        
        this.broadcast(outputSignal);
    }

}

export default AmplitudeThresholdFilter;