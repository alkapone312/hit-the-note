import AudioStream from "../AudioStream.js";

class MediaRecorderAudioStream extends AudioStream {
    private analyser: AnalyserNode;

    private readyCallback: () => void;

    private requestDataInterval = 0;

    private getDataFunction: () => void;

    public constructor(private readonly timeslice: number) {
        super();
        this.getDataFunction = () => {
            const data = new Float32Array(this.analyser.frequencyBinCount);
            this.analyser.getFloatTimeDomainData(data);
            this.propagateData(data);
        }
        navigator.mediaDevices.getUserMedia({audio: true}).then((stream) => {
            const audioCtx = new AudioContext();
            this.analyser = audioCtx.createAnalyser();
            audioCtx.createMediaStreamSource(stream).connect(this.analyser);
            this.readyCallback();
        });
    }
    
    public startRecording(): void {
        if(this.requestDataInterval !== 0) {
            clearInterval(this.requestDataInterval);
        }
        this.requestDataInterval = setInterval(this.getDataFunction, this.timeslice);
    }

    public stopRecording(): void {
        if(this.requestDataInterval !== 0) {
            clearInterval(this.requestDataInterval);
        }
    }

    public onReady(callback: () => void) {
        this.readyCallback = callback;
    }
}

export default MediaRecorderAudioStream;