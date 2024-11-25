 

import Log from '@/utils/Log.js';
import type {Settings} from '@/audio/Settings.js';
import MediaRecorderAudioStream from '../audio/MediaRecorderAudioStream.js';
import AmplitudeThresholdFilter from '@/audio/filter/AmplitudeThresholdFilter.js';
import HighPassFilter from '@/audio/filter/HighPassFilter.js';
import MovingAverageFilter from '@/audio/filter/MovingAverageFilter.js';
import HammingWindowNode from '@/audio/filter/HammingWindowNode.js';
import FrequencySmootherDecorator from '@/audio/FrequenySmootherDecorator.js';
import {ACFRecognition} from '../../../main.js';
import type SettingsLoader from '@/audio/SettingsLoader.js';

/**
 * Settings loader for browser environment.
 */
class BrowserSettingsLoader implements SettingsLoader {
    
    private audioTrack: MediaStreamTrack;

    private settings: MediaTrackSettings;

    /**
     * Load settings to Settings singleton.
     */
    public async load(): Promise<Settings> {
        [this.audioTrack] = (await navigator
            .mediaDevices
            .getUserMedia({audio: true}))
            .getAudioTracks();
        this.settings = this.audioTrack.getSettings();

        return {
            sampleRate: this.getSampleRate(),
            sampleSize: this.getSampleSize(),
            channelCount: this.getChannelCount(),
            windowSize: this.getWindowSize(),
            recorder: new MediaRecorderAudioStream(1000 / 30),
            filterChain: [
                new AmplitudeThresholdFilter(0.025),
                new HighPassFilter(900),
                new MovingAverageFilter(500),
                new HammingWindowNode()
            ],
            pitchRecognition: new FrequencySmootherDecorator(new ACFRecognition())
        };
    }

    private getSampleRate(): number {
        if (typeof this.settings.sampleRate === 'number') {
            return this.settings.sampleRate;
        }

        if (Object.hasOwn(window, 'AudioContext')) {
            const audioContext = new AudioContext();
            if (Object.hasOwn(audioContext, 'createMediaStreamTrackSource')) {
                // it is used here to fetch sample rate that firefox will record audio
                // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createMediaStreamTrackSource
                // @ts-expect-error AudioContext.createMediaStreamTrackSource is only supported by firefox
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                audioContext.createMediaStreamTrackSource(this.audioTrack);
            }

            return audioContext.sampleRate;
        }
        Log.warn('Cannot fetch default sampleRate, defaulting to 48000Hz');

        return 48000;
    }

    private getSampleSize(): number {
        if (typeof this.settings.sampleSize === 'number') {
            return this.settings.sampleSize;
        }
        Log.warn('Cannot fetch default sampleSize, defaulting to 16');

        return 16;
    }

    private getChannelCount(): number {
        if (typeof this.settings.channelCount === 'number') {
            return this.settings.channelCount;
        }
        Log.warn('Cannot fetch default channelCount, defaulting to 2');

        return 2;
    }

    private getWindowSize(): number {
        return 2 ** 12;
    }
}

export default BrowserSettingsLoader;