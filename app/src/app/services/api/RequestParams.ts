class RequestParams {

    public constructor(
        private readonly baseUrl: string,
        private readonly endpoint: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        private readonly body: any = [],
        private readonly method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
        private readonly additionalHeaders: Record<string, string> = {}
    ) {
    }

    public getBaseUrl(): string {
        return this.baseUrl;
    }

    public getEndpoint(): string {
        return this.endpoint;
    }

    public getMethod(): 'GET' | 'POST' | 'PUT' | 'DELETE' {
        return this.method;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public getBody(): any {
        return this.body;
    }

    public getAdditionalHeaders(): Record<string, string> {
        return this.additionalHeaders;
    }
}

export default RequestParams;