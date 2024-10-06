/* eslint-disable */
import BrowserSettingsLoader from "./browser/BrowserSettingsLoader.js";
import ConsoleLogger from "./utils/ConsoleLogger.js";
import Log from "./utils/Log.js";
import MediaStreamAnalyserAudioStream from "./browser/MediaStreamAnalyserAudioStream.js";
import FFTPitchRecognition from "./FFTPitchRecognition.js";

declare var Chart: any;

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

if(typeof window === 'undefined') {
    throw new Error('Application is meant to run in browser!');
}
Log.setUp(new ConsoleLogger());
Log.setDebug(true);
new BrowserSettingsLoader().load();

const pitchRecognition = new FFTPitchRecognition();
pitchRecognition.onPitchDetected((pitch) => {
    console.log(pitch)
    frequencies.push(pitch);
})
pitchRecognition.onSpectrum((spectrum) => {
    chart.data.labels = [...spectrum];
    chart.data.datasets[0].data = [...spectrum];
    chart.update();
})
const stream = new MediaStreamAnalyserAudioStream(200);
stream.onReady(() => {
    stream.startRecording();
    pitchRecognition.startRecognition(stream);
    setTimeout(() => {
        stream.stopRecording()
        pitchRecognition.stopRecognition()
    }, 20000);
})
