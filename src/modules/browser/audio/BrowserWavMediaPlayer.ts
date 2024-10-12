import MediaPlayerInterface from '../../note/MediaPlayerInterface';

class BrowserWavMediaPlayer implements MediaPlayerInterface {
    private audioContext: AudioContext | null = null;
    private sourceNode: AudioBufferSourceNode | null = null;
    private audioBuffer: AudioBuffer | null = null;
    private isPlaying: boolean = false;
    private startTime: number = 0;
    private elapsedTime: number = 0;

    constructor(private wavFile: File) {}

    // Load the WAV file and decode it
    private async loadWavFile(): Promise<void> {
        this.audioContext = new AudioContext();
        const fileReader = new FileReader();

        // Load the file as an ArrayBuffer
        const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
            fileReader.onload = () => {
                resolve(fileReader.result as ArrayBuffer);
            };
            fileReader.onerror = () => {
                reject(fileReader.error);
            };
            fileReader.readAsArrayBuffer(this.wavFile);
        });

        // Decode the WAV file data into an AudioBuffer
        this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    }

    // Play the audio
    public async play(): Promise<void> {
        if (!this.audioContext) {
            await this.loadWavFile(); // Load and decode the file if not already loaded
        }

        if (this.audioContext && this.audioBuffer && !this.isPlaying) {
            this.sourceNode = this.audioContext.createBufferSource();
            this.sourceNode.buffer = this.audioBuffer;
            this.sourceNode.connect(this.audioContext.destination);

            const offset = (this.elapsedTime ? this.elapsedTime : 0)/1000;
            this.startTime = new Date().getTime();
            this.sourceNode.start(0, offset);

            this.isPlaying = true;
        }
    }

    // Stop the audio
    public stop(): void {
        if (this.isPlaying && this.sourceNode && this.audioContext) {
            this.sourceNode.stop();
            this.elapsedTime += new Date().getTime() - this.startTime;
            this.isPlaying = false;
        }
    }

    // Get the current time of the playback
    public getCurrentTime(): number {
        if (this.isPlaying && this.audioContext) {
            return this.audioContext.currentTime - this.startTime;
        } else if (this.elapsedTime) {
            return this.elapsedTime;
        }
        return 0;
    }
}

export default BrowserWavMediaPlayer;
