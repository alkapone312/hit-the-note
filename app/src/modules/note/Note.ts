
class Note {
    public constructor(
        protected readonly name: string,
        protected readonly frequency: number
    ) {
    }

    public getFrequency(): number {
        return this.frequency;
    }

    public getName(): string {
        return this.name;
    }
}

export default Note;