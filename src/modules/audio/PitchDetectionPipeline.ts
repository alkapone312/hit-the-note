import type {Settings} from '@/audio/Settings';
import type {PitchDetectedCallback} from './pitch/PitchRecognition';
import type PitchRecognition from './pitch/PitchRecognition';
import type RecordingInterface from './RecordingInterface';
import type StreamNode from './StreamNode';

class PitchDetectionPipeline {

    private readonly recorder: RecordingInterface & StreamNode;

    private readonly filterPipeline: StreamNode[];

    private readonly pitchRecognition: PitchRecognition;

    public constructor(settings: Settings) {
        this.recorder = settings.recorder;
        this.filterPipeline = settings.filterChain ?? [];
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

    public onPitchDetected(callback: PitchDetectedCallback): void {
        this.pitchRecognition.onPitchDetected(callback);
    }

    public startDetection(): void {
        this.recorder.startRecording();
    }

    public stopDetection(): void {
        this.recorder.stopRecording();
    }
}

export default PitchDetectionPipeline;