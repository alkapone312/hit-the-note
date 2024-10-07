/* eslint-disable */
import BrowserSettingsLoader from "@/browser/settings/BrowserSettingsLoader.js";
import ConsoleLogger from "@/utils/ConsoleLogger.js";
import Log from "@/utils/Log.js";
import MediaStreamAnalyserAudioStream from "@/browser/audio/MediaStreamAnalyserAudioStream.js";
import FFTPitchRecognition from "@/audio/pitch/FFTPitchRecognition.js";
import Settings from "@/settings/Settings.js";
import ZeroCrossingRecognition from "@/audio/pitch/ZeroCrossingRecognition.js";
import AutoCorrelationPitchRecognition from "@/audio/pitch/AutoCorrelationPitchRecognition.js";
import HammingWindowNode from "@/audio/filter/HammingWindowNode.js";
import MovingAverageLowPassFilter from "@/audio/filter/MovingAverageLowPassFilter.js";
import HighPassFilter from "@/audio/filter/HighPassFilter.js";
import AmplitudeThresholdFilter from "@/audio/filter/AmplitudeThresholdFilter.js";
import VisualiseNode from "@/browser/audio/VisualiseNode.js";
import PitchRecognition from "@/audio/pitch/PitchRecognition.js";
import FFTNode from "@/audio/node/FFTNode";

(async () => {
    if(typeof window === 'undefined') {
        throw new Error('Application is meant to run in browser!');
    }

    // set up
    Log.setUp(new ConsoleLogger());
    Log.setDebug(true);
    await new BrowserSettingsLoader().load();

    // draw chart
    const canvas1 = (document.getElementById('canvas1') as HTMLCanvasElement)
    const ctx1 = canvas1.getContext('2d');
    const canvas2 = (document.getElementById('canvas2') as HTMLCanvasElement)
    const ctx2 = canvas2.getContext('2d');
    const canvas3 = (document.getElementById('canvas3') as HTMLCanvasElement)
    const ctx3 = canvas3.getContext('2d');

    // set up recognition
    const settings = Settings.getInstance();
    const sampleRate = settings.get('sampleRate').getValue() as number;
    // const windowSize = settings.get('windowSize').getValue() as number;
    const windowSize = 4096;
    const frequency = new Array(canvas2.width).fill(0) as number[];
    const audioCtx = new AudioContext();
    const osc = audioCtx.createOscillator();
    osc.connect(audioCtx.destination);
    osc.start();
    
    const pitchCb = (pitch) => {
        for(let i = 0 ; i < 5; i++) {
            osc.frequency.setValueAtTime(frequency.shift(), audioCtx.currentTime);
            frequency.push(pitch);
        }
    };
    
    const stream = new MediaStreamAnalyserAudioStream(20, windowSize, sampleRate);
    await stream.setUp();
    const fftNode = new FFTNode();

    // const recognition = new FFTPitchRecognition(fftNode, sampleRate)
    // const recognition = new ZeroCrossingRecognition(sampleRate)
    const recognition = new AutoCorrelationPitchRecognition(sampleRate);
    recognition.onPitchDetected(pitchCb);
    
    const hammingWindow = new HammingWindowNode();
    const amplitudeThresholdFilter = new AmplitudeThresholdFilter(0.025);
    const highPassFilter = new HighPassFilter(900, sampleRate);
    const movingAverageLowPassFilter = new MovingAverageLowPassFilter(500);
    stream.connect(amplitudeThresholdFilter);
    amplitudeThresholdFilter.connect(movingAverageLowPassFilter);
    movingAverageLowPassFilter.connect(highPassFilter);
    highPassFilter.connect(hammingWindow);
    hammingWindow.connect(recognition);
    stream.startRecording();

    let recording = true;
    document.addEventListener('keydown', (e) => {
        if(e.key == " ") {
            if(recording) {
                stream.stopRecording();
                osc.frequency.setValueAtTime(0, audioCtx.currentTime);
                recording = false;
            } else {
                stream.startRecording();
                recording = true;
            }
        }
    })

    // drawing
    const visualise1 = new VisualiseNode(canvas1.width, canvas1.height, ctx1);
    const visualise2 = new VisualiseNode(canvas2.width, canvas2.height, ctx2);
    const visualise3 = new VisualiseNode(canvas3.width, canvas3.height, ctx3);
    const movingAverage = new MovingAverageLowPassFilter(0);
    movingAverage.connect(visualise3);
    hammingWindow.connect(visualise1);
    hammingWindow.connect(fftNode);
    fftNode.onSpectrum(spectrum => {
        visualise2.accept(spectrum);
    });
    recognition.onPitchDetected(() => {
        movingAverage.accept(new Float32Array(frequency));
    })
    document.body.addEventListener('keydown', (e) => {
        if(e.key == 'r') {
            frequency.fill(0);
        }
    })
})();