import PitchRecognition from "@/audio/pitch/PitchRecognition";
import StreamNode from "@/audio/StreamNode";
import RecordingInterface from "./RecordingInterface";

interface PipelineSettings {
    sampleRate: number;
    sampleSize: number;
    channelCount: number;
    windowSize: number;
}

interface Settings extends PipelineSettings {
    recorder: RecordingInterface & StreamNode<Float32Array, Float32Array>;
    filterChain?: StreamNode<Float32Array, Float32Array>[];
    pitchRecognition: PitchRecognition;
}

export { Settings, PipelineSettings };