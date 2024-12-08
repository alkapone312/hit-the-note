import type {Settings} from './Settings.js';

/**
 * Interface to load default settings.
 */
interface SettingsLoader {
    load(): Promise<Settings>;
}

export default SettingsLoader;