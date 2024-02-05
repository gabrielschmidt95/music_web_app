import AlbumData from '../models/Album';
import Token from './Token';
import { GetDiscogs, GetById } from './Discogs';
import FetchSpotify from '../services/Spotify';

let token = sessionStorage.getItem("token")

async function FetchAlbums(artist: string): Promise<AlbumData[]> {
    if (token === null) {
        await Token();
        token = sessionStorage.getItem("token");
    }
    const url = `https://${process.env.REACT_APP_API_DOMAIN}/album/artist`
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ artist: artist })
    };
    let response = await fetch(url, requestOptions);
    if (response.status === 401) {
        await Token();
        token = sessionStorage.getItem("token");
        response = await fetch(url, requestOptions);
    }
    const data = await response.json() as AlbumData[];
    if (data === null) {
        return [];
    }
    data.sort((a, b) => {
        if (a.releaseYear < b.releaseYear) {
            return -1;
        }
        if (a.releaseYear > b.releaseYear) {
            return 1;
        }
        return 0;
    });
    return data;
}


async function HandleAlbum(album: AlbumData) {
    let uri = "";
    console.log(album);
    if (album.id === undefined || album.id === "") {
        uri = `https://${process.env.REACT_APP_API_DOMAIN}/new/album`;
    }
    else {
        uri = `https://${process.env.REACT_APP_API_DOMAIN}/update/album`;
    }

    if (album.spotify === null) {
        album.spotify = await FetchSpotify(album.artist, album.title);
    }

    if (album.discogs === undefined || album.discogs === null || album.discogs.id === 0) {
        console.log("Discogs", album);
        album.discogs = await GetDiscogs(album);
    }

    if (token === null) {
        await Token();
        token = sessionStorage.getItem("token");
    }
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(album)
    };
    let response = await fetch(uri, requestOptions);
    console.log(await response.text());
    if (response.status === 401) {
        await Token();
        token = sessionStorage.getItem("token");
        await fetch(uri, requestOptions);
    }

}

async function RemoveAlbum(id: string) {
    console.log(id);
    if (token === null) {
        await Token();
        token = sessionStorage.getItem("token");
    }
    const uri = `https://${process.env.REACT_APP_API_DOMAIN}/delete/album`
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ id: id })
    };
    let response = await fetch(uri, requestOptions);
    console.log(await response.text());
    if (response.status === 401) {
        await Token();
        token = sessionStorage.getItem("token");
        await fetch(uri, requestOptions);
    }

}

async function UpdateDiscogs(discogsId: string, album: AlbumData) {
    album.discogs = await GetById(discogsId);
    console.log(album);
    await HandleAlbum(album);
}

async function FetchAlbumsByYearMetric(year: number, metric: string): Promise<Record<string, string>[]> {
    console.log(JSON.stringify({ year: year, metric: metric }));
    if (token === null) {
        await Token();
        token = sessionStorage.getItem("token");
    }
    const url = `https://${process.env.REACT_APP_API_DOMAIN}/album/year`
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ year: year, metric: metric })
    };
    let response = await fetch(url, requestOptions);
    if (response.status === 401) {
        await Token();
        token = sessionStorage.getItem("token");
        response = await fetch(url, requestOptions);
    }
    const data = await response.json() as Record<string, string>[];
    if (data === null) {
        return [];
    }
    if(metric === "purchase") {
    data.sort((a, b) => {
        if (a.purchase < b.purchase) {
            return -1;
        }
        if (a.purchase > b.purchase) {
            return 1;
        }
        return 0;
    });
    } else {
        data.sort((a, b) => {
            if (a.artist < b.artist) {
                return -1;
            }
            if (a.artist > b.artist) {
                return 1;
            }
            return 0;
        });
    }

    return data;
}

export {
    FetchAlbums,
    HandleAlbum,
    RemoveAlbum,
    UpdateDiscogs,
    FetchAlbumsByYearMetric
}