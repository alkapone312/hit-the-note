/* eslint-disable */
import BrowserSettingsLoader from "./browser/BrowserSettingsLoader.js";
import ConsoleLogger from "./utils/ConsoleLogger.js";
import Log from "./utils/Log.js";
import MediaStreamAnalyserAudioStream from "./browser/MediaStreamAnalyserAudioStream.js";
import FFTPitchRecognition from "./FFTPitchRecognition.js";
import Settings from "./settings/Settings.js";
import ZeroCrossingRecognition from "./ZeroCrossingRecognition.js";

declare var Chart: any;

(async () => {

    if(typeof window === 'undefined') {
        throw new Error('Application is meant to run in browser!');
    }

    // set up
    Log.setUp(new ConsoleLogger());
    Log.setDebug(true);
    await new BrowserSettingsLoader().load();

    // draw chart
    const ctx = document.getElementById('myCanvas') as HTMLCanvasElement;
    const chart = new Chart(ctx, {
        type: 'line',
        responsive: false,
        data: {
            labels: [],
            datasets: [{
                data: []
            }]
        },
        options: {
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Value'
                    }
                }
            }
        }
    });

    // set up recognition
    const settings = Settings.getInstance();
    const sampleRate = settings.get('sampleRate').getValue() as number;

    const fftRecognition = new FFTPitchRecognition(sampleRate);
    fftRecognition.onPitchDetected((pitch) => {
        console.log('fft: ' + pitch)
    })
    fftRecognition.onSpectrum((spectrum) => {
        chart.data.labels = [...spectrum];
        chart.data.datasets[0].data = [...spectrum];
        chart.update();
    })
    const zeroCrossingRecognition = new ZeroCrossingRecognition(sampleRate)
    zeroCrossingRecognition.onPitchDetected((pitch) => {
        console.log('zcr: ' + pitch);
    })
    const stream = new MediaStreamAnalyserAudioStream(200, sampleRate);
    stream.connect(fftRecognition);
    stream.connect(zeroCrossingRecognition);
    stream.startRecording();
    setTimeout(() => {
        stream.stopRecording();
    }, 3000)
})()