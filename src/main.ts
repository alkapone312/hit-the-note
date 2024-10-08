/* eslint-disable */
import BrowserSettingsLoader from "@/browser/settings/BrowserSettingsLoader.js";
import ConsoleLogger from "@/utils/ConsoleLogger.js";
import Log from "@/utils/Log.js";
import MediaStreamAnalyserAudioStream from "@/browser/audio/MediaStreamAnalyserAudioStream.js";
import FFTPitchRecognition from "@/audio/pitch/FFTPitchRecognition.js";
import ZeroCrossingRecognition from "@/audio/pitch/ZeroCrossingRecognition.js";
import AutoCorrelationPitchRecognition from "@/audio/pitch/AutoCorrelationPitchRecognition.js";
import HammingWindowNode from "@/audio/filter/HammingWindowNode.js";
import MovingAverageLowPassFilter from "@/audio/filter/MovingAverageLowPassFilter.js";
import HighPassFilter from "@/audio/filter/HighPassFilter.js";
import AmplitudeThresholdFilter from "@/audio/filter/AmplitudeThresholdFilter.js";
import VisualiseNode from "@/browser/audio/VisualiseNode.js";
import PitchRecognition from "@/audio/pitch/PitchRecognition.js";
import FFTNode from "@/audio/node/FFTNode";
import PitchDetectionPipeline from "@/audio/PitchDetectionPipeline";

(async () => {
    if(typeof window === 'undefined') {
        throw new Error('Application is meant to run in browser!');
    }

    // set up
    Log.setUp(new ConsoleLogger());
    Log.setDebug(true);
    // const settings = await new BrowserSettingsLoader().load();

    const recorder = new MediaStreamAnalyserAudioStream(10);
    const fftNode = new FFTNode();
    const hammingWindow = new HammingWindowNode();

    const pitchDetectionPipeline = new PitchDetectionPipeline({
        sampleRate: 44100,
        sampleSize: 16,
        windowSize: 4096,
        channelCount: 2,
        recorder: recorder,
        filterChain: [
            new AmplitudeThresholdFilter(0.025),
            new HighPassFilter(900),
            new MovingAverageLowPassFilter(500),
            hammingWindow
        ],
        pitchRecognition: new AutoCorrelationPitchRecognition()
    });

    await recorder.setUp();

    const audioCtx = new AudioContext();
    const osc = audioCtx.createOscillator();
    osc.connect(audioCtx.destination);
    osc.start();
    
    pitchDetectionPipeline.startDetection();
    let recording = true;
    document.addEventListener('keydown', (e) => {
        if(e.key == " ") {
            if(recording) {
                pitchDetectionPipeline.stopDetection();
                osc.frequency.setValueAtTime(0, audioCtx.currentTime);
                recording = false;
            } else {
                pitchDetectionPipeline.startDetection();
                recording = true;
            }
        }
    })

    // drawing
    const canvas1 = (document.getElementById('canvas1') as HTMLCanvasElement)
    const ctx1 = canvas1.getContext('2d');
    const canvas2 = (document.getElementById('canvas2') as HTMLCanvasElement)
    const ctx2 = canvas2.getContext('2d');
    const canvas3 = (document.getElementById('canvas3') as HTMLCanvasElement)
    const ctx3 = canvas3.getContext('2d');
    const visualise1 = new VisualiseNode(canvas1.width, canvas1.height, ctx1);
    const visualise2 = new VisualiseNode(canvas2.width, canvas2.height, ctx2);
    const visualise3 = new VisualiseNode(canvas3.width, canvas3.height, ctx3);
    const frequency = new Array(canvas2.width).fill(0) as number[];
    hammingWindow.connect(visualise1);
    hammingWindow.connect(fftNode);
    fftNode.onSpectrum(spectrum => {
        visualise2.accept(spectrum);
    });
    pitchDetectionPipeline.onPitchDetected((pitch) => {
        osc.frequency.setValueAtTime(frequency.shift(), audioCtx.currentTime);
        frequency.push(pitch);
        visualise3.accept(new Float32Array(frequency));
    })
    document.body.addEventListener('keydown', (e) => {
        if(e.key == 'r') {
            frequency.fill(0);
        }
    })
})();