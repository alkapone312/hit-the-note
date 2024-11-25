class Loading {
    public static load(asyncFunction: () => Promise<unknown>): void {
        this.startLoadingCallback();
        asyncFunction().then(() => {
            this.endLoadingCallback(); 
        }).catch(() => {
            this.endLoadingCallback(); 
        });
    }
    
    public static onStartLoading(callback: () => void): void {
        this.startLoadingCallback = callback;
    }
    
    public static onEndLoading(callback: () => void): void {
        this.endLoadingCallback = callback;
    }
    
    private static startLoadingCallback = (): void => {};
    
    private static endLoadingCallback = (): void => {};
}

export default Loading;