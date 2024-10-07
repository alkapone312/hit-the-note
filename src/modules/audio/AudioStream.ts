import StreamNode from "@/audio/StreamNode.js";

abstract class AudioStream extends StreamNode<Float32Array, Float32Array> {
    constructor(protected readonly sampleRate: number) {
        super();
    }

    public getSampleRate(): number {
        return this.sampleRate;
    }
}

export default AudioStream;