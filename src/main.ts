/* eslint-disable */
import BrowserSettingsLoader from "./browser/BrowserSettingsLoader.js";
import ConsoleLogger from "./utils/ConsoleLogger.js";
import MicrophoneAudioStream from "./MicrophoneAudioStream.js";
import Log from "./utils/Log.js";
import ZeroCrossingRecognition from "./ZeroCrossingRecognition.js";

declare var Chart: any;

if(typeof window === 'undefined') {
    throw new Error('Application is meant to run in browser!');
}
Log.setUp(new ConsoleLogger());
new BrowserSettingsLoader().load();
// const pitchRecognition = new ZeroCrossingRecognition();
// const audioStream = new MicrophoneAudioStream();

// pitchRecognition.onPitchDetected((frequency) => {
//     console.log(frequency)
// })

// pitchRecognition.startRecognition(audioStream);

// pitchRecognition.stopRecognition();
console.log(navigator.userAgent)
const ctx = document.getElementById('myCanvas') as HTMLCanvasElement;
const chart = new Chart(ctx, {
    type: 'line',
    responsive: true,
    data: {
        labels: [],
        datasets: [{
            data: []
        }]
    }
});


(async () => {
    // const mediaStream = await navigator.mediaDevices.getUserMedia({audio: {
    //     autoGainControl: false,
    //     echoCancellation: false,
    //     noiseSuppression: false,
    //     channelCount: 1,
    //     sampleSize: 16,
    //     sampleRate: 44.1
    // }});
    // const mediaRecorder = new MediaRecorder(mediaStream);
    
    // let chunks = [];
    // mediaRecorder.addEventListener('dataavailable', (event: BlobEvent) => {
    //     event.data.arrayBuffer().then(buffer => {
    //         const arr = new Int16Array(buffer);
    //         const s = Math.max(...arr);
    //         chart.data.labels.push(1);
    //         chart.data.datasets[0].data.push(s);
    //         chart.update();
    //     })
    // })

    // mediaRecorder.addEventListener('stop', (event: BlobEvent) => {
    //     const blob = new Blob(chunks)
    //     chunks = [];

    //     console.log('ok');
    // });

    // mediaRecorder.start(1000/10);
    // setTimeout(() => {
    //     mediaRecorder.stop();
    // }, 30000);
})()

