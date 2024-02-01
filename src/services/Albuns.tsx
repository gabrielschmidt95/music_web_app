import AlbumData from '../models/Album';
import Token from './Token';

var token = sessionStorage.getItem("token")

async function FetchAlbums(artist: string): Promise<AlbumData[]> {
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
        body: JSON.stringify({ artist: artist })
    };
    var response = await fetch(`https://${process.env.REACT_APP_API_DOMAIN}/album/artist`, requestOptions);
    if (response.status === 401) {
        await Token();
        token = sessionStorage.getItem("token");
        response = await fetch(`https://${process.env.REACT_APP_API_DOMAIN}/album/artist`, requestOptions);
    }

    return await response.json() as AlbumData[];
}


async function HandleAlbum(album : AlbumData) {
    console.log(album);
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
    let response = await fetch(`https://${process.env.REACT_APP_API_DOMAIN}/new/album`, requestOptions);
    console.log(response.text());
    if (response.status === 401) {
        await Token();
        token = sessionStorage.getItem("token");
        await fetch(`https://${process.env.REACT_APP_API_DOMAIN}/new/album`, requestOptions);
    }

}

async function RemoveAlbum(id : string) {
    console.log(id);
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
        body: JSON.stringify({id: id})
    };
    let response = await fetch(`https://${process.env.REACT_APP_API_DOMAIN}/delete/album`, requestOptions);
    console.log(response.text());
    if (response.status === 401) {
        await Token();
        token = sessionStorage.getItem("token");
        await fetch(`https://${process.env.REACT_APP_API_DOMAIN}/new/album`, requestOptions);
    }

}

export {
    FetchAlbums,
    HandleAlbum,
    RemoveAlbum
}