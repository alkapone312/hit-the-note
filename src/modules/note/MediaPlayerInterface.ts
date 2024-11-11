
interface MediaPlayerInterface {
    play(): void;
    stop(): void;
    getTimeLength(): number;
    getCurrentTime(): number;
    setCurrentTime(time: number);
    getFile(): File;
}

export default MediaPlayerInterface;