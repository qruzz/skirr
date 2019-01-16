import * as COLORS from './colors';

/**
 * This function gets the coordinates of the current position using the
 * geoplocation API and returns a JS promise. If the API retrives the location
 * the promise will be resolved with the retrieved data, otherwise it will be
 * rejected with the error.
 * @returns	{func}	The JS Promise
 */
export function getLocationData() {
	return new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition((position) => {
			resolve(position);
		}, (error) => {
			reject(error);
		}), {
			enableHighAccuracy: false,
			timeout: 2000,
			maximumAge: 1000,
		};
	});
}

/**
 * This functions determines which message to render in the application based on
 * the passed through carbon intensity value. This is a simple case of using three
 * arbitrarily selected limits.
 * @param	{number}	carbonIntensity	The current carbon intensity value
 * @param	{string}	zone			The zone in which it the value was sourced
 * @returns	{string}					The custom message string
 */
export function determineMessage(carbonIntensity, zone) {
	// Split the zone string by daches and return the first split, corresponding to country code
	const formattedZone = zone.split('-')[0];

	// Good
	if (carbonIntensity < 100) {
		return (`The carbon intensity is looking good right now in the ${formattedZone} zone. Keep up the good work.`);
	}

	// Average
	if (carbonIntensity > 100 && carbonIntensity < 250) {
		return (`The carbon intensity is not quite perfect right now in the ${formattedZone} zone. Mabye you should take the bus today`);
	}

	// Bad
	return (`The carbon intensity is not looking so good right now in the ${formattedZone} zone. Mabye you should call your government 😉`);
}

/**
 * This function determines which colour to render in the application based on
 * the passed through carbon intensity value. This is a simple case of using three
 * arbitrarily selected values. On a would choose the lower and upper limit, and then
 * interpolate the colours into a new spectrum, than can them be transitioned between.
 * @param	{number}	carbonIntensity	The current carbon intensity value
 * @returns	{string}					Returns the hex colour code
 */
export function determineColor(carbonIntensity) {
	// Good
	if (carbonIntensity < 100) {
		return (COLORS.BG_GOOD);
	}

	// Average
	if (carbonIntensity > 100 && carbonIntensity < 250) {
		return (COLORS.BG_AVERAGE);
	}

	// Bad
	return (COLORS.BG_BAD);
}
