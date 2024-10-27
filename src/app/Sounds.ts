class Sounds {
    private static sounds: Record<string, HTMLAudioElement>;

    static {
        this.sounds = {
            "button_click": new Audio('sounds/button_click.wav'),
        }
    }

    public static play(name: string) {
        this.sounds[name].play();
    }
}

export default Sounds;