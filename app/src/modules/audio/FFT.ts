
/**
 * Class performing fft operation, allows to fetch real and imaginary
 * part of fft and also spectrum of it
 */
class FFT {
    private real: Float32Array;

    private imag: Float32Array;

    private spectrum: Float32Array;

    public compute(data: Float32Array): void {
        const N = data.length;
    
        // Create arrays for the real and imaginary parts
        this.real = data.slice();
        this.imag = new Float32Array(N);
    
        // Perform FFT on the data
        this.fft(this.real, this.imag);
    
        // Compute the magnitude of the spectrum (|complex number|)
        this.spectrum = new Float32Array(N / 2); // We only need half of the spectrum
        for (let i = 0; i < N / 2; i++) {
            this.spectrum[i] = Math.sqrt(this.real[i] * this.real[i] + this.imag[i] * this.imag[i]);
        }
    }

    public getReal(): Float32Array {
        return this.real;
    }

    public getImag(): Float32Array {
        return this.imag;
    }

    public getSpectrum(): Float32Array {
        return this.spectrum;
    }

    private fft(real: Float32Array, imag: Float32Array): void {
        const N = real.length;
    
        if (N <= 1) return;
    
        // Divide into even and odd parts
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
    
        // Recursively perform FFT on even and odd parts
        this.fft(evenReal, evenImag);
        this.fft(oddReal, oddImag);
    
        // Combine the results using the butterfly operation
        for (let k = 0; k < halfSize; k++) {
            const angle = -2 * Math.PI * k / N;
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
}

export default FFT;