
type StreamDataCallback = (data: Int16Array) => void;

abstract class AudioStream {
    private callbacks: StreamDataCallback[] = [];
    
    public onData(callback: StreamDataCallback) {
        this.callbacks.push(callback);
    }

    protected propagateData(data: Int16Array) {
        this.callbacks.forEach(cb => cb(data));
    }
}

export default AudioStream;