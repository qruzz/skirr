
const APIURL = 'https://api.electricitymap.org/v3';
const API_TOKEN = 'rILfhiFrZ3emXcVMGU62';
// const API_TOKEN = process.env.API_TOKEN;

export function getLiveCarbonIntensity(coords) {
    return fetch(`${APIURL}/carbon-intensity/latest?lon=${coords.lng}&lat=${coords.lat}`, {
        method: 'GET',
        headers: {
            'auth-token': API_TOKEN,
        },
    }).then(async (response) => {
        const json = await response.json();
        return (json);
    }).catch((error) => {
        console.log(error);
    });
}
