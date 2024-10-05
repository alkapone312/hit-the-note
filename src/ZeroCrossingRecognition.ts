import AudioStream from "./AudioStream.js";
import PitchRecognition from "./PitchRecognition.js";

class ZeroCrossingRecognition extends PitchRecognition {
    public startRecognition(stream: AudioStream): void {
        console.log(stream);
        throw new Error("Method not implemented.");
    }

    public stopRecognition(): void {
        throw new Error("Method not implemented.");
    }
}

export default ZeroCrossingRecognition;