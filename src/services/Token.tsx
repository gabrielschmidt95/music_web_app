async function FetchToken(): Promise<boolean> {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "client_id": process.env.REACT_APP_CLIENT_ID,
            "client_secret": process.env.REACT_APP_CLIENT_SECRET,
            "audience": process.env.REACT_APP_AUDIENCE,
            "grant_type": "client_credentials"
        }),
    };
    const response = await fetch(`https://${process.env.REACT_APP_OAUTH_DOMAIN}/oauth/token`, requestOptions);
    const data = await response.json();
    sessionStorage.setItem("token", data.access_token);

    return true;
}

export default FetchToken;