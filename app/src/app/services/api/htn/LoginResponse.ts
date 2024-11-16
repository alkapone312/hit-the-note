class LoginResponse {
    public constructor(private readonly token: string) {
    }

    public getToken(): string {
        return this.token;
    }
}

export default LoginResponse;