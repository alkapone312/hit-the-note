import PitchDetectionPipeline from "./PitchDetectionPipeline.js";
import RecordingInterface from "./RecordingInterface.js";
import SettingsLoader from "./SettingsLoader.js";
import StreamNode from "./StreamNode.js";

class PitchDetectionPipelineFactory {
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