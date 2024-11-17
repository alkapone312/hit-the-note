import Response from "../Response.js";
import Requester from "../Requester.js";
import RequestParams from "../RequestParams.js";
import NoteTrackMetadata from "@/note/NoteTrackMetadata.js";
import LoginResponse from "./LoginResponse.js";
import NoteTracksResponse from "./NoteTracksResponse.js";
import RegisterResponse from "./RegisterResponse.js";
import NoteTrackResponse from "./NoteTrackResponse.js";
import NoteTrackImporter from "@/note/NoteTrackImporter.js";

class HtnRequestFactory {
    private readonly url = 'http://localhost:8080';

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

    public async getNoteTracks(): Promise<Response<NoteTracksResponse>> {
        const response = await this.requester.request(this.getNoteTracksParams());
        const json = await response.json()

        return new Response(new NoteTracksResponse(json.map((item) => {
            return new NoteTrackMetadata(item.title, item.artist, item.filename)
        })));
    }

    public async getNoteTrack(filename: string): Promise<Response<NoteTrackResponse>> {
        const response = await this.requester.request(this.getNoteTrackParams(filename));
        const noteTrack = await (new NoteTrackImporter()).import(await response.blob());

        return new Response(new NoteTrackResponse(noteTrack));
    }

    private registerParams(username: string, email: string, password: string): RequestParams {
        return new RequestParams(this.url, '/login', {username, email, password});
    }

    private loginParams(email: string, password: string): RequestParams {
        return new RequestParams(this.url, '/login', {email, password});
    }
    
    private getNoteTracksParams(): RequestParams {
        return new RequestParams(this.url, '/note-tracks');
    }

    private getNoteTrackParams(filename: string): RequestParams {
        return new RequestParams(this.url, '/note-tracks/' + filename);
    }
}

export default HtnRequestFactory;