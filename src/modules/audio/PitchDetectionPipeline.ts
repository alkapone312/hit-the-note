import { Settings } from "@/audio/Settings";
import PitchRecognition, { PitchDetectedCallback } from "./pitch/PitchRecognition";
import RecordingInterface from "./RecordingInterface";
import StreamNode from "./StreamNode";

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
            node.setSettings(settings)
            lastNode.connect(node)
            lastNode = node;
        });
        this.pitchRecognition.setSettings(settings);
        lastNode.connect(this.pitchRecognition);
    }

    public onPitchDetected(callback: PitchDetectedCallback) {
        this.pitchRecognition.onPitchDetected(callback);
    }

    public startDetection() {
        this.recorder.startRecording();
    }

    public stopDetection() {
        this.recorder.stopRecording();
    }
}

export default PitchDetectionPipeline;