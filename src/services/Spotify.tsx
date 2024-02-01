import { Buffer } from "buffer";

const client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const client_secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

async function getToken(): Promise<boolean> {
    console.log("Fetching token");
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        body: new URLSearchParams({
            'grant_type': 'client_credentials',
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
        },
    });

    const token = await response.json();
    sessionStorage.setItem("spotifyToken", token.access_token);

    return true;
}


async function FetchSpotify(artist: string, album: string): Promise<any> {
    if (!sessionStorage.getItem("spotifyToken")) {
        await getToken();
    }

    let token = sessionStorage.getItem("spotifyToken");
    let requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    };
    let q = `artist:${artist} album:${album}`;
    const params = `q=${q}&type=album`;

    let result = await fetch(`https://api.spotify.com/v1/search?${encodeURI(params)}`, requestOptions);;
    if (result.status === 401) {
        await getToken();
        requestOptions.headers = {
            'Authorization': 'Bearer ' + sessionStorage.getItem("spotifyToken")
        };
        result = await fetch(`https://api.spotify.com/v1/search?${encodeURI(params)}`, requestOptions);
    }
    const data = await result.json();
    
    return data.albums.items[0];

}

export default FetchSpotify;