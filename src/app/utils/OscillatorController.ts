class OscillatorController {
    private audioContext: AudioContext;
    private oscillator: OscillatorNode | null = null;
  
    public constructor() {
      this.audioContext = new AudioContext();
    }
  
    public start(frequency: number = 440): void {
      if (this.oscillator) {
        this.oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        return;
      }
  
      this.oscillator = this.audioContext.createOscillator();
      this.oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
  
      this.oscillator.connect(this.audioContext.destination);
  
      this.oscillator.start();
    }
  
    public stop(): void {
      if (!this.oscillator) {
        return;
      }
  
      // Stop the oscillator and clean up
      this.oscillator.stop();
      this.oscillator.disconnect();
      this.oscillator = null;
      console.log("Oscillator stopped");
    }
}

export default OscillatorController;