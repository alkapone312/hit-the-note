
type StreamDataCallback = (data: Float32Array) => void;

abstract class AudioStream {
    private callbacks: StreamDataCallback[] = [];

    protected sampleRate: number = 44100;
    
    public onData(callback: StreamDataCallback) {
        this.callbacks.push(callback);
    }

    public getSampleRate(): number {
        return this.sampleRate;
    }

    protected propagateData(data: Float32Array) {
        this.callbacks.forEach(cb => cb(data));
    }
}

export default AudioStream;