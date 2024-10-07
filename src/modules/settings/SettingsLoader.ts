import Settings from "@/settings/Settings";

interface SettingsLoader {
    load(): Promise<Settings>;
}

export default SettingsLoader;