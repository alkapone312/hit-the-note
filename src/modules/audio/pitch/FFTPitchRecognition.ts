import PitchRecognition from '@/audio/pitch/PitchRecognition.js';
import type FFTNode from '@/audio/node/FFTNode.js';

class FFTPitchRecognition extends PitchRecognition {
    
    public constructor(
        private readonly fftNode: FFTNode
    ) {
        super();
        this.fftNode.onSpectrum((spectrum) => {
            this.recognizePeak(spectrum);
        });
    }

    public accept(data: Float32Array): void {
        this.fftNode.accept(data);
        this.broadcast(data);
    }

    private recognizePeak(spectrum: Float32Array): void {
        let index = 0;
        let max = 0;
        for (let i = 0 ; i < spectrum.length; i++) {
            if (spectrum[i] > max) {
                max = spectrum[i];
                index = i;
            }
        }
        const frequency = index / spectrum.length * this.settings.sampleRate / 2;
        this.pitchDetected(frequency);
    }
}

export default FFTPitchRecognition;