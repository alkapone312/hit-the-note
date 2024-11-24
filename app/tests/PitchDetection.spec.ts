import { describe, it, expect, vi } from 'vitest';
import { 
    ACFAndAMDFPitchRecognition,
    AMDFPitchRecognition,
    FFTPitchRecognition,
    ACFRecognition,
    PitchDetectedCallback,
    PipelineSettings,
    AmplitudeThresholdFilter,
    HighPassFilter,
    MovingAverageFilter,
    HammingWindowNode,
    StreamNode,
    ZeroCrossingRecognition,
    HPSPitchRecognition,
    CBHPSPitchRecognition,
    PitchRecognition
} from '../src/main.js';
import FrequencySmootherDecorator from '@/audio/FrequenySmootherDecorator.js';

expect.extend({
    toBeBetween(received: number, floor: number, ceiling: number) {
        const pass = received >= floor && received <= ceiling;
        if (pass) {
            return {
                message: () => `expected ${received} not to be between ${floor} and ${ceiling}`,
                pass: true,
            };
        } else {
            return {
                message: () => `expected ${received} to be between ${floor} and ${ceiling}`,
                pass: false,
            };
        }
    },
});

const generateSineWave = (frequency, sampleRate, numSamples) => {
    const samples = new Float32Array(numSamples);
    const angularFrequency = 2 * Math.PI * frequency / sampleRate;

    for (let i = 0; i < numSamples; i++) {
        const sample = Math.sin(angularFrequency * i);
        samples[i] = sample;
    }
    return samples;
};

const generateHarmonicWave = (frequency, sampleRate, numSamples, numHarmonics) => {
    const samples = new Float32Array(numSamples);
    const angularFrequency = 2 * Math.PI * frequency / sampleRate;

    for (let i = 0; i < numSamples; i++) {
        let sample = 0;
        for (let harmonic = 1; harmonic <= numHarmonics; harmonic++) {
            const harmonicFrequency = frequency * harmonic;
            const harmonicAngularFrequency = 2 * Math.PI * harmonicFrequency / sampleRate;
            sample += Math.sin(harmonicAngularFrequency * i);
        }
        samples[i] = sample;
    }
    return samples;
};

const settings = {
    sampleRate: 44100,
    windowSize: 4096
} as PipelineSettings;

const pitchRecognitions = [
    ZeroCrossingRecognition,
    ACFRecognition,
    AMDFPitchRecognition,
    ACFAndAMDFPitchRecognition,
    FFTPitchRecognition,
];

const pitchRecognitionsWithHarmonics = [
    HPSPitchRecognition,
    CBHPSPitchRecognition,
]

const pitches = [
    100,
    200,
    400,
    600,
    800
]

const ACCEPTABLE_ERROR_MARGIN = 0.05; // Allow 5% error

describe('PitchRecognition subclasses', () => {
    pitches.forEach(pitch => {
        pitchRecognitions.forEach((Class) => {
            it(`should detect pitch within an acceptable error margin for ${Class.name} pitch ${pitch}`, () => {
                const recognition = new Class();
                recognition.setSettings(settings);
                const filters = [
                    new AmplitudeThresholdFilter(0.025),
                    new HighPassFilter(900),
                    new MovingAverageFilter(500),
                    new HammingWindowNode(),
                ]
                let lastFilter: StreamNode | null = null;
                filters.forEach(f => {
                    f.setSettings(settings);
                    if(!lastFilter) {
                        lastFilter = f;
                        return;
                    }

                    lastFilter.connect(f);
                })
                filters[filters.length-1].connect(recognition);

                const expectedPitch = pitch
                const waveform = generateSineWave(expectedPitch, settings.sampleRate, settings.windowSize)
                
                let computedFrequency = 0;
                const callback: PitchDetectedCallback = (frequency) => {
                    computedFrequency = frequency;
                };
                
                recognition.onPitchDetected(callback);
                filters[0].accept(waveform);
                
                expect(computedFrequency).toBeBetween(expectedPitch - expectedPitch * ACCEPTABLE_ERROR_MARGIN, expectedPitch + expectedPitch * ACCEPTABLE_ERROR_MARGIN);
            });
        });

        pitchRecognitionsWithHarmonics.forEach((Class) => {
            it(`should detect pitch within an acceptable error margin for ${Class.name} pitch ${pitch} with multiple harmonics`, () => {
                const recognition = new Class();
                recognition.setSettings(settings);
                const filters = [
                    new AmplitudeThresholdFilter(0.025),
                    new HighPassFilter(900),
                    new MovingAverageFilter(500),
                    new HammingWindowNode(),
                ]
                let lastFilter: StreamNode | null = null;
                filters.forEach(f => {
                    f.setSettings(settings);
                    if(!lastFilter) {
                        lastFilter = f;
                        return;
                    }

                    lastFilter.connect(f);
                })
                filters[filters.length-1].connect(recognition);

                const expectedPitch = pitch
                const waveform = generateHarmonicWave(expectedPitch, settings.sampleRate, settings.windowSize, 5)
                
                let computedFrequency = 0;
                const callback: PitchDetectedCallback = (frequency) => {
                    computedFrequency = frequency;
                };
                
                recognition.onPitchDetected(callback);
                filters[0].accept(waveform);
                
                expect(computedFrequency).toBeBetween(expectedPitch - expectedPitch * ACCEPTABLE_ERROR_MARGIN, expectedPitch + expectedPitch * ACCEPTABLE_ERROR_MARGIN);
            });
        });
    })
});

describe('Frequency smoother', () => {
    it('Should even out spontanous peaks in frequency', () => {
        const mockPitchRecognition = new class extends PitchRecognition {
            public accept(data: Float32Array): void {
                throw new Error('Method not implemented.');
            }
            public pitch(pitch: number): void {
                this.pitchDetected(pitch);
            }
        }
        const freq = new Array(100).fill(100);
        freq[20] = 300;
        freq[21] = 400;
        freq[22] = 500;
        freq[23] = 300;

        freq[55] = 200;
        freq[56] = 100;
        freq[57] = 1000;
        freq[58] = 5000;
        freq[59] = 5000;

        const smoothedFrequency: number[] = [];
        const smoother = new FrequencySmootherDecorator(mockPitchRecognition, 10);
        smoother.onPitchDetected((freq: number) => {
            smoothedFrequency.push(freq);
        })
        for(let i = 0; i < freq.length; i++) {
            mockPitchRecognition.pitch(freq[i]);
        }

        expect(smoothedFrequency.filter(f => f !== 100).length).toBe(0)
    })
})