import PitchRecognition from '@/audio/pitch/PitchRecognition.js';

/**
 * Pitch detection algorithm based on autocorrelation. Compares 
 * signal with it's copy shifted by some time and checks weather 
 * there was a peak indicating period. Differs with ACF by performing
 * subtraction instead of multiplication.
 */
class AMDFPitchRecognition extends PitchRecognition {

    /**
     * {@inheritDoc}
     */
    public accept(data: Float32Array): void {
        const N = data.length;
        // Step 1: Normalize the input signal to have zero mean (remove DC offset)
        const mean = data.reduce((acc, val) => acc + val, 0) / N;
        const normalizedSignal = data.map(val => val - mean);

        // Step 2: Compute the AMDF for different lags
        const amdf = new Float32Array(N);
        for (let lag = 0; lag < N; lag++) {
            let sum = 0;
            for (let i = 0; i < N - lag; i++) {
                sum += Math.abs(normalizedSignal[i] - normalizedSignal[i + lag]);
            }
            amdf[lag] = sum / (N - lag);
        }
        
        // Step 3: Find the first minimum in the AMDF function
        let minIndex = -1;
        let minValue = Infinity;

        const minLag = Math.floor(this.settings.sampleRate / 900);  // Consider frequencies up to x Hz
        const maxLag = Math.floor(this.settings.sampleRate / 50);   // Ignore unrealistic low frequencies below 50 Hz

        for (let lag = minLag; lag < maxLag; lag++) {
            if (amdf[lag] < minValue) {
                minValue = amdf[lag];
                minIndex = lag;
            }
        }

        if (minIndex > 0) {
            const estimatedFrequency = this.settings.sampleRate / minIndex;

            if (estimatedFrequency < 900) {
                this.pitchDetected(estimatedFrequency);
            } else {
                this.pitchDetected(0);
            }
        }
        this.broadcast(data);
    }
}

export default AMDFPitchRecognition;
