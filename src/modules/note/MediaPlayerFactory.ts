import MediaPlayerInterface from "./MediaPlayerInterface.js";

interface MediaPlayerFactory {
    createForFile(file: File): MediaPlayerInterface;
}

export default MediaPlayerFactory;