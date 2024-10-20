import StreamNode from '@/audio/StreamNode.js';
import FFT from '../FFT.js';

type SpectrumCallback = (spectrum: Float32Array) => void;

type FFTCallback = (real: Float32Array, imag: Float32Array) => void;

class FFTNode extends StreamNode {
    private readonly spectrumCallbacks: SpectrumCallback[] = [];

    private readonly fft = new FFT();

    public accept(data: Float32Array): void {
        this.fft.compute(data);
        this.spectrumCallbacks.forEach(cb => {
            cb(this.fft.getSpectrum());
        });
        this.broadcast(data);
    }

    public onSpectrum(callback: SpectrumCallback): void {
        this.spectrumCallbacks.push(callback);
    }
}

export default FFTNode;