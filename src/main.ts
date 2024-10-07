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

(async () => {
    if(typeof window === 'undefined') {
        throw new Error('Application is meant to run in browser!');
    }

    // set up
    Log.setUp(new ConsoleLogger());
    Log.setDebug(true);
    await new BrowserSettingsLoader().load();

    // draw chart
    const freqCanvas = (document.getElementById('frequencyCanvas') as HTMLCanvasElement)
    const freqCtx = freqCanvas.getContext('2d');
    const waveCanvas = (document.getElementById('waveformCanvas') as HTMLCanvasElement)
    const waveCtx = waveCanvas.getContext('2d');
    function line(x, y, dx, dy) {
        freqCtx.strokeStyle = "black";
        freqCtx.stroke();
        freqCtx.beginPath();
        freqCtx.moveTo(x, freqCanvas.height - y);
        freqCtx.lineTo(dx, freqCanvas.height - dy);
        freqCtx.closePath();
    }

    // set up recognition
    const settings = Settings.getInstance();
    const sampleRate = settings.get('sampleRate').getValue() as number;
    // const windowSize = settings.get('windowSize').getValue() as number;
    const windowSize = 8192;
    const frequency = new Array(freqCanvas.width).fill(100) as number[];
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
    
    // const recognition = new FFTPitchRecognition(sampleRate)
    // const recognition = new ZeroCrossingRecognition(sampleRate)
    const stream = new MediaStreamAnalyserAudioStream(20, windowSize, sampleRate);
    await stream.setUp();
    const recognition = new AutoCorrelationPitchRecognition(sampleRate);
    recognition.onPitchDetected(pitchCb);
    
    const hammingWindow = new HammingWindowNode();
    const amplitudeThresholdFilter = new AmplitudeThresholdFilter(0.025);
    const highPassFilter = new HighPassFilter(900, sampleRate);
    const movingAverageLowPassFilter = new MovingAverageLowPassFilter(1000);
    const visualiseNode = new VisualiseNode(waveCanvas.width, waveCanvas.height, waveCtx);
    stream.connect(amplitudeThresholdFilter);
    amplitudeThresholdFilter.connect(movingAverageLowPassFilter);
    movingAverageLowPassFilter.connect(highPassFilter);
    highPassFilter.connect(hammingWindow);
    hammingWindow.connect(visualiseNode);
    visualiseNode.connect(recognition);
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

    setInterval(() => {
        freqCtx.fillStyle = "white";
        freqCtx.fillRect(0, 0, freqCanvas.width, freqCanvas.height);
        const max = 2000;
        for(let i = 0 ; i < frequency.length-1; i++) {
            const oldValue = frequency[i] / max * freqCanvas.height;
            const newValue = frequency[i + 1] / max * freqCanvas.height;
            line(i, oldValue, i+1, newValue);
        }
    }, 1000/30);
})()