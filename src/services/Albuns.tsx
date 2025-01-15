import AlbumData from '../models/Album';
import Token from './Token';
import { GetDiscogs, GetById } from './Discogs';
import FetchSpotify from '../services/Spotify';

let token = sessionStorage.getItem("token")
const protocol = process.env.REACT_APP_API_DOMAIN?.includes('localhost') ? 'http' : 'https';

async function getHeader(): Promise<Record<string, string>> {
    while (token === null) {
        await Token();
        token = sessionStorage.getItem("token");
    }
    return {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    };
}

async function FetchAlbums(artist: string): Promise<AlbumData[]> {
    const url = `${protocol}://${process.env.REACT_APP_API_DOMAIN}/album/artist`
    const requestOptions = {
        method: 'POST',
        headers: await getHeader(),
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

async function FetchAlbumByTitle(title: string): Promise<AlbumData[]> {
    const url = `${protocol}://${process.env.REACT_APP_API_DOMAIN}/title`
    const requestOptions = {
        method: 'POST',
        headers: await getHeader(),
        body: JSON.stringify({ title: title })
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
    return data;
}


async function HandleAlbum(album: AlbumData) {
    let uri = "";
    if (album.id === undefined || album.id === "") {
        uri = `${protocol}://${process.env.REACT_APP_API_DOMAIN}/new/album`;
    }
    else {
        uri = `${protocol}://${process.env.REACT_APP_API_DOMAIN}/update/album`;
    }

    if (album.spotify === null) {
        album.spotify = await FetchSpotify(album.artist, album.title);
    }

    const requestOptions = {
        method: 'POST',
        headers: await getHeader(),
        body: JSON.stringify(album)
    };
    let response = await fetch(uri, requestOptions);

    if (response.status === 401) {
        await Token();
        token = sessionStorage.getItem("token");
        await fetch(uri, requestOptions);
    }
    return response;

}

async function RemoveAlbum(id: string) {
    const uri = `${protocol}://${process.env.REACT_APP_API_DOMAIN}/delete/album`
    const requestOptions = {
        method: 'POST',
        headers: await getHeader(),
        body: JSON.stringify({ id: id })
    };
    let response = await fetch(uri, requestOptions);
    if (response.status === 401) {
        await Token();
        token = sessionStorage.getItem("token");
        await fetch(uri, requestOptions);
    }

}

async function UpdateDiscogs(discogsId: string, album: AlbumData) {
    if (discogsId === "0") {
        return await HandleAlbum(album);
    }
    
    const discogs = await GetById(discogsId);
    if (discogs.id === undefined) {
        return;
    }
    album.discogs = discogs;
    return await HandleAlbum(album);
}

function sortYearData(data: Record<string, string>[], metric: string): Record<string, string>[] {
    if (metric === "purchase") {
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

function sortByArtist(data: Record<string, number>[]): Record<string, string | number>[] {
    data.sort((a, b) => {
        if (a.artist < b.artist) {
            return -1;
        }
        if (a.artist > b.artist) {
            return 1;
        }
        return 0;
    });
    return data;
}


async function FetchAlbumsByYearMetric(year: number, metric: string): Promise<Record<string, string>[]> {
    const url = `${protocol}://${process.env.REACT_APP_API_DOMAIN}/album/year`
    const requestOptions = {
        method: 'POST',
        headers: await getHeader(),
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
    return sortYearData(data, metric);
}

async function Aggregate(qyery: object): Promise<Record<string, number | string>[]> {
    const url = `${protocol}://${process.env.REACT_APP_API_DOMAIN}/aggregation`
    const requestOptions = {
        method: 'POST',
        headers: await getHeader(),
        body: JSON.stringify(qyery)
    };

    let response = await fetch(url, requestOptions);
    if (response.status === 401) {
        await Token();
        token = sessionStorage.getItem("token");
        response = await fetch(url, requestOptions);
    }
    const data = await response.json() as Record<string, number>[];
    if (data === null) {
        return [];
    }
    return data;
}

async function Find(qyery: object): Promise<Record<string, number | string>[]> {
    const url = `${protocol}://${process.env.REACT_APP_API_DOMAIN}/find`
    const requestOptions = {
        method: 'POST',
        headers: await getHeader(),
        body: JSON.stringify(qyery)
    };

    let response = await fetch(url, requestOptions);
    if (response.status === 401) {
        await Token();
        token = sessionStorage.getItem("token");
        response = await fetch(url, requestOptions);
    }
    const data = await response.json() as Record<string, number>[];
    if (data === null) {
        return [];
    }

    return sortByArtist(data);
}

async function FindAndSort(qyery: object): Promise<Record<string, number | string>[]> {
    const url = `${protocol}://${process.env.REACT_APP_API_DOMAIN}/findAndSort`
    const requestOptions = {
        method: 'POST',
        headers: await getHeader(),
        body: JSON.stringify(qyery)
    };

    let response = await fetch(url, requestOptions);
    if (response.status === 401) {
        await Token();
        token = sessionStorage.getItem("token");
        response = await fetch(url, requestOptions);
    }
    const data = await response.json() as Record<string, number>[];
    if (data === null) {
        return [];
    }

    return sortByArtist(data);
}


async function ExportCollection(): Promise<AlbumData[]> {
    const url = `${protocol}://${process.env.REACT_APP_API_DOMAIN}/all`
    const requestOptions = {
        method: 'GET',
        headers: await getHeader(),
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
    data.sort((a, b) => {
        if (a.artist < b.artist) {
            return -1;
        }
        if (a.artist > b.artist) {
            return 1;
        }
        return 0;
    });
    return data;
}

export {
    FetchAlbums,
    HandleAlbum,
    RemoveAlbum,
    UpdateDiscogs,
    FetchAlbumsByYearMetric,
    FetchAlbumByTitle,
    Aggregate,
    Find,
    GetDiscogs,
    FindAndSort,
    ExportCollection
}