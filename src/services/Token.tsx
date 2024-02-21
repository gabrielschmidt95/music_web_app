async function FetchToken(): Promise<boolean> {
    const userDetailsByIdUrl = `https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/users/${sessionStorage.getItem("userSub")}`;
    const metadataResponse = await fetch(userDetailsByIdUrl, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
        },
    });

    const { user_metadata } = await metadataResponse.json();
    console.log(user_metadata);
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "client_id": user_metadata.CLIENT_ID,
            "client_secret": user_metadata.CLIENT_SECRET,
            "audience": user_metadata.AUDIENCE,
            "grant_type": "client_credentials"
        }),
    };
    const response = await fetch(`https://${process.env.REACT_APP_OAUTH_DOMAIN}/oauth/token`, requestOptions);
    const data = await response.json();
    sessionStorage.setItem("token", data.access_token);

    return true;
}

export default FetchToken;