import PitchRecognition from '@/audio/pitch/PitchRecognition.js';
import FFT from '../FFT.js';

/**
 * Pitch recognition algorithm estimates the fundamental frequency 
 * of a signal by down-sampling its spectrum at integer multiples 
 * and multiplying these down-sampled versions together. 
 */
class HPSPitchRecognition extends PitchRecognition {
    
    /**
     * Class performing fft operation
     */
    private readonly fft = new FFT();
    
    /**
     * {@inheritDoc}
     */
    public accept(data: Float32Array): void {
        this.fft.compute(data);
        const spectrum = this.fft.getSpectrum();
        // Compute the HPS
        const hpsOrder = 5;  // Number of harmonic products
        const hps = new Float32Array(spectrum.length);

        // Copy the original spectrum as the first layer of HPS
        for (let i = 0; i < spectrum.length; i++) {
            hps[i] = spectrum[i];
        }

        // Downsample and multiply subsequent harmonics
        for (let k = 2; k <= hpsOrder; k++) {
            for (let i = 0; i < Math.floor(spectrum.length / k); i++) {
                hps[i] *= spectrum[i * k];  // Multiply by downsampled spectrum
            }
        }

        // Find the first maximum in the HPS spectrum
        let maxIndex = -1;
        let maxValue = -Infinity;

        const minHzIndex = Math.floor(2 * 50 * spectrum.length / this.settings.sampleRate);
        const maxHzIndex = Math.floor(2 * 900 * spectrum.length / this.settings.sampleRate);

        for (let i = minHzIndex; i < maxHzIndex; i++) {
            if (hps[i] > maxValue) {
                maxValue = hps[i];
                maxIndex = i;
            }
        }

        if (maxIndex > 0) {
            const estimatedFrequency = maxIndex / spectrum.length * this.settings.sampleRate / 2;
            this.pitchDetected(estimatedFrequency);
        } else {
            this.pitchDetected(0);
        }
        this.broadcast(data);
    }
}

export default HPSPitchRecognition;
