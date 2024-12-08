/**
 * Interface that should be implemented by recorder to work in pitch detection pipeline.
 */
interface RecordingInterface {

    /**
     * Start signal recording and broadcasting.
     */
    startRecording(): void;

    /**
     * Stop signal recording and broadcasting
     */
    stopRecording(): void;

    /**
     * Set up recorder if it needs to be prepered. F.e ask user for microphone access
     */
    setUp(): Promise<void>;
}

export default RecordingInterface;