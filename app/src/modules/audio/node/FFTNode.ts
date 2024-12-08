import StreamNode from '@/audio/StreamNode.js';
import FFT from '../FFT.js';

/**
 * Callback invoked when spectrum has been calculated
 */
type SpectrumCallback = (spectrum: Float32Array) => void;

/**
 * Node that will compute fft spectrum and broadcast it in provided callback.
 */
class FFTNode extends StreamNode {

    /**
     * List of registered callbacks
     */
    private readonly spectrumCallbacks: SpectrumCallback[] = [];

    /**
     * fft performing class
     */
    private readonly fft = new FFT();

    /**
     * {@inheritDoc}
     */
    public accept(data: Float32Array): void {
        this.fft.compute(data);
        this.spectrumCallbacks.forEach(cb => {
            cb(this.fft.getSpectrum());
        });
        this.broadcast(data);
    }

    /**
     * Add spectrum callback
     */
    public onSpectrum(callback: SpectrumCallback): void {
        this.spectrumCallbacks.push(callback);
    }
}

export default FFTNode;