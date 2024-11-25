import type {Settings} from './Settings.js';

interface SettingsLoader {
    load(): Promise<Settings>;
}

export default SettingsLoader;