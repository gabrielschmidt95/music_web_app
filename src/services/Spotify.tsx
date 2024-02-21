import { Buffer } from "buffer";

async function getToken(): Promise<boolean> {
    const userDetailsByIdUrl = `https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/users/${sessionStorage.getItem("userSub")}`;
    const metadataResponse = await fetch(userDetailsByIdUrl, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
        },
    });

    const { user_metadata } = await metadataResponse.json();

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        body: new URLSearchParams({
            'grant_type': 'client_credentials',
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (Buffer.from(user_metadata.SPOTIFY_CLIENT_ID + ':' + user_metadata.SPOTIFY_CLIENT_SECRET).toString('base64')),
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