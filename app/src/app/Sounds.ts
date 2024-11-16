class Sounds {
    private static sounds: Record<string, HTMLAudioElement>;

    static {
        this.sounds = {
            "click": new Audio('sounds/click.wav'),
        }
    }

    public static play(name: string) {
        this.sounds[name].play();
    }
}

export default Sounds;