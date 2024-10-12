import type PitchRecognition from '@/audio/pitch/PitchRecognition';
import type StreamNode from '@/audio/StreamNode';
import type RecordingInterface from './RecordingInterface';

interface PipelineSettings {
    sampleRate: number;
    sampleSize: number;
    channelCount: number;
    windowSize: number;
}

interface Settings extends PipelineSettings {
    recorder: RecordingInterface & StreamNode;
    filterChain?: StreamNode[];
    pitchRecognition: PitchRecognition;
}

export type {Settings, PipelineSettings};