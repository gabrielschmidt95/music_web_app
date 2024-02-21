import { useEffect, useState } from 'react';
import Token from './Token';
import Artist from '../models/Artist'

let token = sessionStorage.getItem("token")

async function fetchArtists(): Promise<string[]> {
    while (token === null) {
        await Token();
        token = sessionStorage.getItem("token");
    }
    let requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    };
    let response = await fetch(`https://${process.env.REACT_APP_API_DOMAIN}/artists`, requestOptions);
    if (response.status === 401) {
        await Token();
        token = sessionStorage.getItem("token");
        requestOptions.headers.Authorization = 'Bearer ' + token;
        response = await fetch(`https://${process.env.REACT_APP_API_DOMAIN}/artists`, requestOptions);
    }

    return await response.json();
}

function Artists(): Artist[] {
    const [artists, setArtists] = useState<string[]>([]);
    useEffect(() => {
        async function fetchData() {
            const data = await fetchArtists();
            setArtists(data);

        }
        fetchData();
    }, []);

    return artists.map((item) => {
        return (
            { id: item, name: item }
        )
    })
}

export default Artists;