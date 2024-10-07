import StreamNode from "@/audio/StreamNode.js";

/**
 * Apply amplitude thresholding to filter out low-amplitude noise or silence.
 */
class AmplitudeThresholdFilter extends StreamNode<Float32Array, Float32Array> {
    public constructor(private readonly threshold) {
        super();
    }

    public accept(data: Float32Array) {
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