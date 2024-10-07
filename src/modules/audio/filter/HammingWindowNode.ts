import StreamNode from "@/audio/StreamNode.js";

class HammingWindowNode extends StreamNode<Float32Array, Float32Array> {
    public accept(data: Float32Array) {
        const N = data.length;
        const windowedSignal = new Float32Array(N);
        for (let i = 0; i < N; i++) {
            const hammingFactor = 0.54 - 0.46 * Math.cos((2 * Math.PI * i) / (N - 1));
            windowedSignal[i] = data[i] * hammingFactor;
        }
        this.broadcast(windowedSignal)
    }
}

export default HammingWindowNode;