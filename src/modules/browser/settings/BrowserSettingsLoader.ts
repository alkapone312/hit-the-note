import Log from "@/utils/Log.js";
import Settings from "@/settings/Settings";
import SettingsLoader from "@/settings/SettingsLoader";

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
        this.audioTrack = (await navigator
            .mediaDevices
            .getUserMedia({audio: true}))
            .getAudioTracks()[0]
        this.settings = this.audioTrack.getSettings();

        return {
            sampleRate: this.getSampleRate(),
            sampleSize: this.getSampleSize(),
            channelCount: this.getChannelCount(),
            windowSize: this.getWindowSize(),
        }
    }

    private getSampleRate(): number {
        if(Object.hasOwn(this.settings, 'sampleRate')) {
            return this.settings.sampleRate;
        }

        if(Object.hasOwn(window, 'AudioContext')) {
            const audioContext = new AudioContext();
            if(Object.hasOwn(audioContext, 'createMediaStreamTrackSource')) {
                // @ts-expect-error AudioContext.createMediaStreamTrackSource is only supported by firefox
                // it is used here to fetch sample rate that firefox will record audio
                // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createMediaStreamTrackSource
                audioContext.createMediaStreamTrackSource(this.audioTrack);
            }

            return audioContext.sampleRate;
        }
        Log.warn("Cannot fetch default sampleRate, defaulting to 48000Hz");

        return 48000;
    }

    private getSampleSize(): number {
        if(Object.hasOwn(this.settings, 'sampleSize')) {
            return this.settings.sampleSize;
        }
        Log.warn("Cannot fetch default sampleSize, defaulting to 16")

        return 16;
    }

    private getChannelCount(): number {
        if(Object.hasOwn(this.settings, 'channelCount')) {
            return this.settings.channelCount;
        }
        Log.warn("Cannot fetch default channelCount, defaulting to 2")

        return 2;
    }

    private getWindowSize(): number {
        return 2**15;
    }
}

export default BrowserSettingsLoader;