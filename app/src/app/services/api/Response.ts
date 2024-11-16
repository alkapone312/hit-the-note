class Response<T> {
    public constructor(private readonly value: T) {}

    public get(): T {
        return this.value;
    }
}

export default Response;