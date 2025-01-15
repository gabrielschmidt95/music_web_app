import Token from './Token';
import TotalsData from '../models/Totals';

let token = sessionStorage.getItem("token")
const protocol = process.env.REACT_APP_API_DOMAIN?.includes('localhost') ? 'http' : 'https';

async function Totals() :Promise<TotalsData>{
    while (token === null) {
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
    let response = await fetch(`${protocol}://${process.env.REACT_APP_API_DOMAIN}/totals`, requestOptions);
    if (response.status === 401) {
        await Token();
        token = sessionStorage.getItem("token");
        response = await fetch(`${protocol}://${process.env.REACT_APP_API_DOMAIN}/totals`, requestOptions);
    }

    return await response.json() as TotalsData;
}

export default Totals;