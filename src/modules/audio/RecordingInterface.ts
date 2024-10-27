interface RecordingInterface {
    startRecording(): void;

    stopRecording(): void;

    setUp(): Promise<void>;
}

export default RecordingInterface;