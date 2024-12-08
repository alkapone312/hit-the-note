import type MediaPlayerInterface from './MediaPlayerInterface.js';

/**
 * Interface for creation of mediaplayer based on the environment.
 */
interface MediaPlayerFactory {
    createForFile(file: File): MediaPlayerInterface;
}

export default MediaPlayerFactory;