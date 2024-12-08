import PitchRecognition from '@/audio/pitch/PitchRecognition.js';

/**
 * Simple pitch detection algorithms that estimates 
 * pitch by calculating number of times the signal crossed zero.
 */
class ZeroCrossingRecognition extends PitchRecognition {

    /**
     * {@inheritDoc}
     */
    public accept(data: Float32Array): void {
        const N = data.length;  // Length of the input array
        let zeroCrossings = 0;  // To count the number of zero crossings

        // Step 1: Iterate through the signal to detect zero crossings
        for (let i = 1; i < N; i++) {
            // Check for a sign change (zero crossing) between adjacent samples
            if (data[i - 1] >= 0 && data[i] < 0 || 
                data[i - 1] < 0 && data[i] >= 0) {
                zeroCrossings++;
            }
        }

        // Step 2: Calculate zero crossing rate (ZCR)
        const zcr = zeroCrossings / N;  // Zero crossings per sample

        // Step 3: Estimate the fundamental frequency (pitch)
        // The factor of 2 accounts for positive and negative half cycles in one period
        const estimatedFrequency = this.settings.sampleRate / 2 * zcr;
        this.pitchDetected(estimatedFrequency);
        
        this.broadcast(data);
    }
}

export default ZeroCrossingRecognition;