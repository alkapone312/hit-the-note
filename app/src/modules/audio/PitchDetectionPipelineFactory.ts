import PitchDetectionPipeline from "./PitchDetectionPipeline.js";
import RecordingInterface from "./RecordingInterface.js";
import { Settings } from "./Settings.js";
import SettingsLoader from "./SettingsLoader.js";
import StreamNode from "./StreamNode.js";

class PitchDetectionPipelineFactory {
    public createFromSettings(settings: Settings): PitchDetectionPipeline {
        const pitchDetectionPipeline = new PitchDetectionPipeline(settings);
        pitchDetectionPipeline.getRecorder().setUp();

        return pitchDetectionPipeline;
    }

    public createFromSettingsWithDifferentRecorder(settings: Settings, recorder: RecordingInterface & StreamNode) {
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

    public async createFromLoaderWithDifferentRecorder(loader: SettingsLoader, recorder: RecordingInterface & StreamNode) {
        const settings = await loader.load();
        settings.recorder = recorder;
        const pitchDetectionPipeline = new PitchDetectionPipeline(settings);
        pitchDetectionPipeline.getRecorder().setUp();

        return pitchDetectionPipeline;
    }
}

export default PitchDetectionPipelineFactory;