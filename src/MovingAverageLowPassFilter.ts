import StreamNode from "./StreamNode.js";

/**
 * Simple low-pass filter (moving average) to smooth the signal.
 */
class MovingAverageLowPassFilter extends StreamNode<Float32Array, Float32Array> {

    constructor(private readonly windowSize: number) {
        super();
    }

    public accept(data: Float32Array) {
        const filteredSignal = new Float32Array(data.length);
        for (let i = 0; i < data.length; i++) {
            let sum = 0;
            const start = Math.max(0, i - Math.floor(this.windowSize / 2));
            const end = Math.min(data.length - 1, i + Math.floor(this.windowSize / 2));
            for (let j = start; j <= end; j++) {
                sum += data[j];
            }
            filteredSignal[i] = sum / (end - start + 1);
        }

        this.broadcast(filteredSignal);
    }

}

export default MovingAverageLowPassFilter;