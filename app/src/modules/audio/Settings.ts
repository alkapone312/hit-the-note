import type PitchRecognition from '@/audio/pitch/PitchRecognition.js';
import type StreamNode from '@/audio/StreamNode.js';
import type RecordingInterface from './RecordingInterface.js';

interface PipelineSettings {
    sampleRate: number;
    sampleSize: number;
    channelCount: number;
    windowSize: number;
}

interface Settings extends PipelineSettings {
    recorder: RecordingInterface & StreamNode;
    filterChain: StreamNode[];
    pitchRecognition: PitchRecognition;
}

export type {Settings, PipelineSettings};