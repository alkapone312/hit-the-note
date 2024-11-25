import PitchDetectionPipeline from './PitchDetectionPipeline.js';
import type RecordingInterface from './RecordingInterface.js';
import type {Settings} from './Settings.js';
import type SettingsLoader from './SettingsLoader.js';
import type StreamNode from './StreamNode.js';

class PitchDetectionPipelineFactory {
    public createFromSettings(settings: Settings): PitchDetectionPipeline {
        const pitchDetectionPipeline = new PitchDetectionPipeline(settings);
        pitchDetectionPipeline.getRecorder().setUp();

        return pitchDetectionPipeline;
    }

    public createFromSettingsWithDifferentRecorder(settings: Settings, recorder: RecordingInterface & StreamNode): PitchDetectionPipeline {
        settings.recorder = recorder;
        const pitchDetectionPipeline = new PitchDetectionPipeline(settings);
        pitchDetectionPipeline.getRecorder().setUp();

        return pitchDetectionPipeline;
    }

    public async createFromLoader(loader: SettingsLoader): Promise<PitchDetectionPipeline> {
        const settings = await loader.load();
        const pitchDetectionPipeline = new PitchDetectionPipeline(settings);
        pitchDetectionPipeline.getRecorder().setUp();

        return pitchDetectionPipeline;
    }

    public async createFromLoaderWithDifferentRecorder(loader: SettingsLoader, recorder: RecordingInterface & StreamNode): PitchDetectionPipeline {
        const settings = await loader.load();
        settings.recorder = recorder;
        const pitchDetectionPipeline = new PitchDetectionPipeline(settings);
        pitchDetectionPipeline.getRecorder().setUp();

        return pitchDetectionPipeline;
    }
}

export default PitchDetectionPipelineFactory;