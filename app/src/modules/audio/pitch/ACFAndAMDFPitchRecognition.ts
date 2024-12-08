import PitchRecognition from '@/audio/pitch/PitchRecognition.js';

/**
 * Pitch recognition algorith performing simuteanosly ACF and 
 * AMDF functions, and then connects them to create reliable output.
 */
class ACFAndAMDFPitchRecognition extends PitchRecognition {
    
    /**
     * {@inheritDoc}
     */
    public accept(data: Float32Array): void {
        const N = data.length;
        // Step 1: Normalize the input signal to have zero mean (remove DC offset)
        const mean = data.reduce((acc, val) => acc + val, 0) / N;
        const normalizedSignal = data.map(val => val - mean);
        
        // Step 2: Compute the autocorrelation for different lags
        const acf = new Float32Array(N);
        for (let lag = 0; lag < N; lag++) {
            let sum = 0;
            for (let i = 0; i < N - lag; i++) {
                sum += normalizedSignal[i] * normalizedSignal[i + lag];
            }
            acf[lag] = sum;
        }

        const amdf = new Float32Array(N);
        for (let lag = 0; lag < N; lag++) {
            let sum = 0;
            for (let i = 0; i < N - lag; i++) {
                sum += Math.abs(normalizedSignal[i] - normalizedSignal[i + lag]);
            }
            amdf[lag] = sum / (N - lag);
        }

        const product = new Float32Array(N);
        for (let lag = 0 ; lag < N; lag++) {
            product[lag] = acf[lag] / (amdf[lag] + 1);
        }

        // Step 3: Find the first significant peak in the autocorrelation function
        let peakIndex = -1;
        let peakValue = -Infinity;
        
        // Start searching for a peak after some initial lag to avoid the zero lag peak
        const minLag = Math.floor(this.settings.sampleRate / 900);  // Consider frequencies up to x Hz
        const maxLag = Math.floor(this.settings.sampleRate / 50);   // Ignore unrealistic low frequencies below 50 Hz
        
        for (let lag = minLag; lag < maxLag; lag++) {
            if (product[lag] > peakValue) {
                peakValue = product[lag];
                peakIndex = lag;
            }
        }

        if (peakIndex > 0) {
            const estimatedFrequency = this.settings.sampleRate / peakIndex;
            
            if (estimatedFrequency < 900) {
                this.pitchDetected(estimatedFrequency);
            } else {
                this.pitchDetected(0);
            }
        }
        this.broadcast(data);
    }

}

export default ACFAndAMDFPitchRecognition;