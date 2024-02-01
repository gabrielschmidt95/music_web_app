import AlbumData from '../models/Album';
import DiscogsData from '../models/Discogs';


const tokenDiscogs = process.env.REACT_APP_DISCOGS_TOKEN;

function objToQueryString(obj: { [key: string]: any }) {
    const keyValuePairs = [];
    for (const key in obj) {
        keyValuePairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
    }
    return keyValuePairs.join('&');
}

async function fetchDiscogs(queryParameters: Object): Promise<Response> {
    const requestOptions = {
        method: 'GET',
    };

    const queryString = objToQueryString(queryParameters);
    
    return await fetch(`https://api.discogs.com/database/search?${queryString}`, requestOptions);;
}

async function getTracks(data: DiscogsData): Promise<any> {
    const tracks = await fetch(`https://api.discogs.com/${data.type}s/${data.id}`);
    const result = await tracks.json();
    return result["tracklist"];
}

async function GetDiscogs(album: AlbumData) {
    let queryParameters = {
        "token": tokenDiscogs,
        "artist": album.artist,
        "release_title": album.title,
        "barcode": album.barcode,
        "year": album.releaseYear.toString()
    };

    const response = await fetchDiscogs(queryParameters);

    if (response.status === 200) {
        let data = await response.json();
        data = data["results"];
        if (data.isEmpty) {
            const queryParametersFiltered = {
                "token": tokenDiscogs,
                "artist": album.artist,
                "release_title": album.title,
            };
            const responseFiltered = await fetchDiscogs(queryParametersFiltered);
            let dataFiltered = await responseFiltered.json();
            dataFiltered = dataFiltered["results"];

            if (dataFiltered.isEmpty) {
                return {} as DiscogsData;
            }
            data = dataFiltered;
        }
        let discogsData = data[0] as DiscogsData;
        discogsData.len = data.length;
        let urlsList : [{id: number, uri: string}]= [] as any;
        for (const item of data) {
            urlsList.push({
                id: item["id"] as number,
                uri: item["uri"] as string
            });
        }
        discogsData.urls = urlsList;

        discogsData.tracks = await getTracks(discogsData);

        return discogsData;
    } else {
        return {} as DiscogsData;
    }
}

export default GetDiscogs;