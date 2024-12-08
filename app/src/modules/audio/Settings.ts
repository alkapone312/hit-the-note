import type PitchRecognition from '@/audio/pitch/PitchRecognition.js';
import type StreamNode from '@/audio/StreamNode.js';
import type RecordingInterface from './RecordingInterface.js';

/**
 * Settings to be provided to each stream node, whole pipeline should run on these settings.
 */
interface PipelineSettings {
    sampleRate: number;
    sampleSize: number;
    channelCount: number;
    windowSize: number;
}

/**
 * Additional settings to complete pitch recognition pipeline.
 */
interface Settings extends PipelineSettings {
    recorder: RecordingInterface & StreamNode;
    filterChain: StreamNode[];
    pitchRecognition: PitchRecognition;
}

export type {Settings, PipelineSettings};