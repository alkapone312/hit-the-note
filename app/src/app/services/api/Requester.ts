import type RequestParams from './RequestParams.js';

class Requester {
    public async request(params: RequestParams): Promise<Response> {
        const url = `${params.getBaseUrl()}${params.getEndpoint()}`;
        const method = params.getMethod();
        const body = params.getMethod() !== 'GET' ? JSON.stringify(params.getBody()) : undefined;
        const headers = params.getAdditionalHeaders();

        try {
            const response = await fetch(url, {
                method,
                headers,
                body,
                redirect: 'follow'
            });

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            return response;
        } catch (error) {
            console.error(`Error making request to ${url}:`, error);
            throw error;
        }
    }
}

export default Requester;
