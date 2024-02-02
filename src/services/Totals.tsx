import Token from './Token';
import TotalsData from '../models/Totals';

let token = sessionStorage.getItem("token")

async function Totals() :Promise<TotalsData>{
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
    let response = await fetch(`https://${process.env.REACT_APP_API_DOMAIN}/totals`, requestOptions);
    if (response.status === 401) {
        await Token();
        token = sessionStorage.getItem("token");
        response = await fetch(`https://${process.env.REACT_APP_API_DOMAIN}/totals`, requestOptions);
    }

    return await response.json() as TotalsData;
}

export default Totals;