import StreamNode from '@/audio/StreamNode.js';

/**
 * Simple low-pass filter (moving average) to smooth the signal.
 */
class MovingAverageFilter extends StreamNode {

    public constructor(private readonly windowSize = 500) {
        super();
    }

    public accept(data: Float32Array): void {
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

export default MovingAverageFilter;