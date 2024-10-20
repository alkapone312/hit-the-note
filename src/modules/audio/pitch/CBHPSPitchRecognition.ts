import PitchRecognition from '@/audio/pitch/PitchRecognition.js';
import FFT from '../FFT.js';
import { log } from 'console';
import { av } from 'vitest/dist/chunks/reporters.DAfKSDh5.js';

/**
 * Zalecane window size >= 8192
 */
class CBHPSPitchRecognition extends PitchRecognition {
    
    private readonly fft = new FFT();

    public constructor() {
        super();
    }

    public accept(data: Float32Array): void {
        this.fft.compute(data);
        const spectrum = this.fft.getSpectrum();
        const hpsOrder = 5;  // Number of harmonic products
        const hps = new Float32Array(spectrum.length);

        // Initialize the HPS with the original spectrum
        for (let i = 0; i < spectrum.length; i++) {
            hps[i] = spectrum[i];
        }

        // Downsample and multiply subsequent harmonics for HPS calculation
        for (let k = 2; k <= hpsOrder; k++) {
            for (let i = 0; i < Math.floor(spectrum.length / k); i++) {
                hps[i] *= spectrum[i * k];  // Multiply by downsampled spectrum
            }
        }

        // Compute the Cepstrum
        const logSpectrum = new Float32Array(spectrum.length);
        for (let i = 0; i < spectrum.length; i++) {
            logSpectrum[i] = Math.log(spectrum[i] + 1);  // Log of amplitude spectrum
        }

        this.fft.compute(logSpectrum);
        const cepstrum = this.fft.getSpectrum().reverse();

        // Convert Cepstrum to Frequency-Indexed Cepstrum (FIC)
        const fic = new Float32Array(spectrum.length/2);  // Frequency-indexed cepstrum
        for (let k = 1; k < cepstrum.length/2; k++) {
            const ficIndex = Math.floor(spectrum.length/2 / k);
            if (ficIndex < fic.length) {
                fic[ficIndex] = cepstrum[k];
            }
        }
        
        // Multiply FIC with HPS to get Cepstrum-Biased HPS (CBHPS)
        const cbhps = new Float32Array(hps.length/2);
        for (let i = 0; i < hps.length/2; i++) {
            cbhps[i] = fic[i] * hps[i];  // Element-wise multiplication
        }
        
        let maxIndex = -1;
        let maxValue = -Infinity;

        for (let i = 0; i < cbhps.length / 4; i++) {
            if (hps[i] > maxValue) {
                maxValue = hps[i];
                maxIndex = i;
            }
        }

        if (maxIndex > 0) {
            const estimatedFrequency = maxIndex / cbhps.length * this.settings.sampleRate / 4;
            this.pitchDetected(estimatedFrequency);
        } else {
            this.pitchDetected(0);
        }
        this.broadcast(data);
    }
}

export default CBHPSPitchRecognition;
