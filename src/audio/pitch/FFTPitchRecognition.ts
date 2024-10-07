import PitchRecognition from "@/audio/pitch/PitchRecognition.js";
import FFTNode from "../node/FFTNode.js";

class FFTPitchRecognition extends PitchRecognition {
    
    public constructor(
        private readonly fftNode: FFTNode,
        sampleRate: number
    ) {
        super(sampleRate);
        this.fftNode.onSpectrum((spectrum) => {
            this.recognizePeak(spectrum);
        });
    }

    public accept(data: Float32Array) {
        this.fftNode.accept(data);
        this.broadcast(data);
    }

    private recognizePeak(spectrum: Float32Array) {
        let index = 0;
        let max = 0;
        for(let i = 0 ; i < spectrum.length; i++) {
            if(spectrum[i] > max) {
                max = spectrum[i];
                index = i;
            }
        }
        const frequency = index / spectrum.length * this.getSampleRate() / 2;
        this.pitchDetected(frequency);
    }
}

export default FFTPitchRecognition;