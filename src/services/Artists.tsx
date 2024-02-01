import { useEffect, useState } from 'react';
import Token from './Token';


async function fetchArtists(): Promise<string[]> {
    var token = sessionStorage.getItem("token")
    if (token === null) {
        await Token();
        token = sessionStorage.getItem("token");
    }
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    };
    var response = await fetch(`https://${process.env.REACT_APP_API_DOMAIN}/artists`, requestOptions);
    if (response.status === 401) {
        await Token();
        token = sessionStorage.getItem("token");
        response = await fetch(`https://${process.env.REACT_APP_API_DOMAIN}/artists`, requestOptions);
    }

    return await response.json();
}

function Artists() {
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
            { value: item, label: item }
        )
    })
}

export default Artists;