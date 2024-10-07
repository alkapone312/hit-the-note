import StreamNode from "@/audio/StreamNode.js";

type SpectrumCallback = (spectrum: Float32Array) => void;

class FFTNode extends StreamNode<Float32Array, Float32Array> {
    private callbacks: SpectrumCallback[] = []

    public accept(data: Float32Array) {
        const spectrum = this.computeFFT(data);
        this.callbacks.forEach(cb => {
            cb(spectrum);
        })
        this.broadcast(data);
    }

    public onSpectrum(callback: SpectrumCallback): void {
        this.callbacks.push(callback);
    }

    private fft(real, imag) {
        const N = real.length;
    
        if (N <= 1) return;
    
        // Step 3: Divide into even and odd parts
        const halfSize = N / 2;
        const evenReal = new Float32Array(halfSize);
        const evenImag = new Float32Array(halfSize);
        const oddReal = new Float32Array(halfSize);
        const oddImag = new Float32Array(halfSize);
    
        for (let i = 0; i < halfSize; i++) {
            evenReal[i] = real[i * 2];   // Even-indexed real parts
            evenImag[i] = imag[i * 2];   // Even-indexed imaginary parts
            oddReal[i] = real[i * 2 + 1]; // Odd-indexed real parts
            oddImag[i] = imag[i * 2 + 1]; // Odd-indexed imaginary parts
        }
    
        // Step 4: Recursively perform FFT on even and odd parts
        this.fft(evenReal, evenImag);
        this.fft(oddReal, oddImag);
    
        // Step 5: Combine the results using the butterfly operation
        for (let k = 0; k < halfSize; k++) {
            const angle = (-2 * Math.PI * k) / N;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
    
            // Butterfly operation
            const tReal = cos * oddReal[k] - sin * oddImag[k];
            const tImag = sin * oddReal[k] + cos * oddImag[k];
    
            // Update real and imaginary parts
            real[k] = evenReal[k] + tReal;
            imag[k] = evenImag[k] + tImag;
            real[k + halfSize] = evenReal[k] - tReal;
            imag[k + halfSize] = evenImag[k] - tImag;
        }
    }

    private computeFFT(data: Float32Array) {
        const N = data.length;
    
        // Create arrays for the real and imaginary parts
        const real = data.slice(); // Copy of the input (real part)
        const imag = new Float32Array(N);  // Imaginary part (initialized to 0)
    
        // Perform FFT on the data
        this.fft(real, imag);
    
        // Compute the magnitude of the spectrum (|complex number|)
        const spectrum = new Float32Array(N / 2); // We only need half of the spectrum
        for (let i = 0; i < N / 2; i++) {
            spectrum[i] = Math.sqrt(real[i] * real[i] + imag[i] * imag[i]);
        }
    
        return spectrum;
    }
}

export default FFTNode;