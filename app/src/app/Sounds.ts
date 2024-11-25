class Sounds {
    private static sounds: Record<string, HTMLAudioElement>;

    static {
        this.sounds = {
            click: new Audio('sounds/click.wav'),
            beep: new Audio('sounds/beep.mp3'),
            longBeep: new Audio('sounds/long-beep.mp3')
        };
    }

    public static play(name: string): void {
        this.sounds[name].play();
    }
}

export default Sounds;