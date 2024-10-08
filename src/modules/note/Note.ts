
class Note {
    public constructor(
        protected readonly name: string,
        protected readonly frequency: number,
        protected readonly startTime: number,
        protected readonly endTime: number
    ) {
    }

    public getFrequency(): number {
        return this.frequency;
    }

    public getStartTime(): number {
        return this.startTime;
    }

    public getEndTime(): number {
        return this.endTime;
    }

    public getName(): string {
        return this.name;
    }
}

export default Note;