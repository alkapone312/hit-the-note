class Loading {
    private static startLoadingCallback = () => {};
    private static endLoadingCallback = () => {};

    public static load(asyncFunction: () => Promise<unknown>) {
        this.startLoadingCallback()
        asyncFunction().then(() => this.endLoadingCallback()).catch(() => this.endLoadingCallback())
    }

    public static onStartLoading(callback: () => void) {
        this.startLoadingCallback = callback;
    }

    public static onEndLoading(callback: () => void) {
        this.endLoadingCallback = callback;
    }
}

export default Loading;