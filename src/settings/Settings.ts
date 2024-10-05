import NoSuchASettingException from "./NoSuchASettingException.js";
import Setting from "./Setting.js";

/**
 * Singleton class for holding settings of application.
 */
class Settings {
    
    private static instance: Settings;

    protected settings: Record<string, Setting<unknown>>;

    private constructor() {
        this.settings = {};
    }

    /**
     * 
     * @returns Singleton instance of class Settings
     */
    static getInstance(): Settings {
        if(!this.instance) {
            this.instance = new Settings();
        }

        return this.instance;
    }

    /**
     * Register setting. If previously defined overwrite.
     * 
     * @param setting - Setting to be registered
     */
    public register(setting: Setting<unknown>): void {
        this.settings[setting.getName()] = setting;
    }

    /**
     * 
     * @param name - name of the setting
     */
    public get(name: string): Setting<unknown> {
        if(this.settings.hasOwnProperty('name')) {
            return this.settings[name];
        }

        throw new NoSuchASettingException();
    }
}

export default Settings;