import Response from "../Response.js";
import Requester from "../Requester.js";
import RequestParams from "../RequestParams.js";
import NoteTrackMetadata from "@/note/NoteTrackMetadata.js";
import LoginResponse from "./LoginResponse.js";
import NoteTrackResponse from "./NoteTracksResponse.js";
import RegisterResponse from "./RegisterResponse.js";

class HtnRequestFactory {
    private readonly url = '';

    private readonly requester = new Requester();

    public async register(username: string, email: string, password: string): Promise<Response<RegisterResponse>> {
        const response = await this.requester.request(this.registerParams(username, email, password));

        return new Response(new RegisterResponse());
    }

    public async login(email: string, password: string): Promise<Response<LoginResponse>> {
        const response = await this.requester.request(this.loginParams(email, password));
        const json = await response.json()

        return new Response(new LoginResponse(json.token));
    }

    public async getNoteTracks(): Promise<Response<NoteTrackResponse>> {
        const response = await this.requester.request(this.getNoteTracksParams());
        const json = await response.json()

        return new Response(new NoteTrackResponse(json.map((item) => {
            new NoteTrackMetadata(item.title, item.artist, item.filename)
        })));
    }

    private registerParams(username: string, email: string, password: string): RequestParams {
        return new RequestParams(this.url, '/login', {username, email, password})
    }

    private loginParams(email: string, password: string): RequestParams {
        return new RequestParams(this.url, '/login', {email, password})
    }
    
    private getNoteTracksParams(): RequestParams {
        return new RequestParams(this.url, '/note-tracks');
    }
}