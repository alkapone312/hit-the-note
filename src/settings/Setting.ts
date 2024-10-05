/**
 * Class for holding generic type single setting
 */
class Setting<T> {
    constructor(
        protected readonly name: string, 
        protected value: T
    ) {}

    /**
     * @returns The name of the setting
     */
    public getName(): string {
        return this.name;
    }

    /**
     * @returns Value of the setting
     */
    public getValue(): T {
        return this.value;
    }

    /**
     * @param value - Value of specified settings
     */
    public setValue(value: T): void {
        this.value = value;
    }
}

export default Setting;