import type {Settings} from '@/audio/Settings.js';
import type {PitchDetectedCallback} from './pitch/PitchRecognition.js';
import type PitchRecognition from './pitch/PitchRecognition.js';
import type RecordingInterface from './RecordingInterface.js';
import type StreamNode from './StreamNode.js';

/**
 * Facade class of audio module, allowing to group all the provided algorithms
 * into one pitch recognition pipeline.
 */
class PitchDetectionPipeline {

    /**
     * Recorder that will be the source of a signal
     */
    private readonly recorder: RecordingInterface & StreamNode;

    /**
     * Chain of nodes that will prepare signal for recognition.
     */
    private readonly filterPipeline: StreamNode[];

    /**
     * Algorithm that will perform recognition in pipeline
     */
    private readonly pitchRecognition: PitchRecognition;

    /**
     * @param settings - Provides all blocks to build pipeline of pitch recognition. 
     */
    public constructor(settings: Settings) {
        this.recorder = settings.recorder;
        this.filterPipeline = settings.filterChain;
        this.pitchRecognition = settings.pitchRecognition;
        this.recorder.setSettings(settings);
        let lastNode = this.recorder as StreamNode;
        this.filterPipeline.forEach(node => { 
            node.setSettings(settings);
            lastNode.connect(node);
            lastNode = node;
        });
        this.pitchRecognition.setSettings(settings);
        lastNode.connect(this.pitchRecognition);
    }

    /**
     * Registers callback that will be invoked when pitch will be recognized.
     * 
     * @param callback - Pitch recognition callback
     */
    public onPitchDetected(callback: PitchDetectedCallback): void {
        this.pitchRecognition.onPitchDetected(callback);
    }

    /**
     * Start capturing signal of a recorder and recognizing pitch.
     */
    public startDetection(): void {
        this.recorder.startRecording();
    }

    /**
     * Stop the recorder and process of pitch recognition
     */
    public stopDetection(): void {
        this.recorder.stopRecording();
    }

    public getRecorder(): RecordingInterface {
        return this.recorder;
    }

    public getFilterPipeline(): StreamNode[] {
        return this.filterPipeline;
    }

    public getPitchRecognition(): PitchRecognition {
        return this.pitchRecognition;
    }
}

export default PitchDetectionPipeline;