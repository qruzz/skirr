const APIURL = 'https://api.electricitymap.org/v3';
const API_TOKEN = 'rILfhiFrZ3emXcVMGU62';
// const API_TOKEN = process.env.API_TOKEN;

/**
 * This function takes the latitude and longitude in an objects as the parameters,
 * and uses them to get the latest carbon intensity values for the zone corresponding
 * to the coordinates. If the result of the request is OK, the function gets resolved
 * with the response, if not it gets rejected with the error.
 * @param   {object}	coords	The lat and lng coordinates
 * @returns	{object}	Returns either the error or response as an object
 */
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
