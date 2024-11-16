class RequestParams {
    public constructor(
        private readonly baseUrl: string,
        private readonly endpoint: string,
        private readonly body: any = [],
        private readonly method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
        private readonly additionalHeaders: Record<string, string> = {}
    ) {
    }

    public getBaseUrl() {
        return this.baseUrl;
    }

    public getEndpoint() {
        return this.endpoint;
    }

    public getMethod() {
        return this.method;
    }

    public getBody() {
        return this.body;
    }

    public getAdditionalHeaders() {
        return this.additionalHeaders;
    }
}

export default RequestParams;