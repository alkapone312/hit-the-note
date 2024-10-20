import PitchRecognition from '@/audio/pitch/PitchRecognition.js';
import type FFTNode from '@/audio/node/FFTNode.js';
import FFT from '../FFT.js';

class FFTPitchRecognition extends PitchRecognition {
    
    private readonly fft = new FFT();

    public constructor() {
        super();
    }

    public accept(data: Float32Array): void {
        let index = 0;
        let max = 0;
        this.fft.compute(data);
        const spectrum = this.fft.getSpectrum();
        const minHzIndex = Math.floor(2 * 50 * spectrum.length / this.settings.sampleRate);
        const maxHzIndex = Math.floor(2 * 900 * spectrum.length / this.settings.sampleRate);
        for (let i = minHzIndex ; i < maxHzIndex; i++) {
            if (spectrum[i] > max) {
                max = spectrum[i];
                index = i;
            }
        }
        const frequency = index / spectrum.length * this.settings.sampleRate / 2;
        this.pitchDetected(frequency);
        this.broadcast(data);
    }
}

export default FFTPitchRecognition;