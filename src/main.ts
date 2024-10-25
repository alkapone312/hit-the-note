/* eslint-disable */
import ConsoleLogger from "@/utils/ConsoleLogger.js";
import Log from "@/utils/Log.js";
import MediaRecorderAudioStream from "@/browser/audio/MediaRecorderAudioStream.js";
import PitchRecognition from "@/audio/pitch/PitchRecognition.js";
import ACFRecognition from "@/audio/pitch/ACFPitchRecognition.js";
import AMDFPitchRecognition from "@/audio/pitch/AMDFPitchRecognition.js";
import ACFAndAMDFPitchRecognition from "@/audio/pitch/ACFAndAMDFPitchRecognition.js";
import ZeroCrossingRecognition from "@/audio/pitch/ZeroCrossingRecognition.js";
import HammingWindowNode from "@/audio/filter/HammingWindowNode.js";
import MovingAverageLowPassFilter from "@/audio/filter/MovingAverageLowPassFilter.js";
import HighPassFilter from "@/audio/filter/HighPassFilter.js";
import AmplitudeThresholdFilter from "@/audio/filter/AmplitudeThresholdFilter.js";
import VisualiseNode from "@/browser/audio/VisualiseNode.js";
import FFTNode from "@/audio/node/FFTNode.js";
import PitchDetectionPipeline from "@/audio/PitchDetectionPipeline.js";
import BrowserWavMediaPlayer from "@/browser/audio/BrowserWavMediaPlayer.js";
import HPSPitchRecognition from "@/audio/pitch/HPSPitchRecognition.js";
import CBHPSPitchRecognition from "@/audio/pitch/CBHPSPitchRecognition.js";
import FFT from "@/audio/FFT.js";
import FFTPitchRecognition from "@/audio/pitch/FFTPitchRecognition.js";
import Note from "@/note/Note.js";
import NoteTrack from "@/note/NoteTrack.js";
import NoteFactory from "@/note/NoteFactory.js";

import StreamNode from "@/audio/StreamNode.js";
import StreamException from "@/audio/StreamException.js";
import { Settings, PipelineSettings } from "@/audio/Settings.js";
import BrowserSettingsLoader from "@/browser/settings/BrowserSettingsLoader.js";

import RecordingInterface from "@/audio/RecordingInterface.js";
import MediaPlayerInterface from "@/note/MediaPlayerInterface.js";
import MediaPlayerFactory from "@/note/MediaPlayerFactory.js";
import Logger from "@/utils/Logger.js";

export {
    // IO
    MediaRecorderAudioStream,
    BrowserWavMediaPlayer,
    
    // Pitch recognition
    PitchDetectionPipeline,
    ZeroCrossingRecognition,
    ACFRecognition,
    AMDFPitchRecognition,
    ACFAndAMDFPitchRecognition,
    HPSPitchRecognition,
    CBHPSPitchRecognition,
    FFTPitchRecognition,

    // Filters
    HammingWindowNode,
    MovingAverageLowPassFilter,
    HighPassFilter,
    AmplitudeThresholdFilter,

    // Note
    NoteFactory,
    Note,
    NoteTrack,

    // Utils
    StreamNode,
    StreamException,
    FFT,
    FFTNode,
    Log,
    ConsoleLogger,
    VisualiseNode,
    BrowserSettingsLoader,
}

export type {
    Settings, 
    PipelineSettings,


    RecordingInterface, 
    MediaPlayerInterface, 
    MediaPlayerFactory,

    PitchRecognition,


    Logger,
}