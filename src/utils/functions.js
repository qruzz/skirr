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
			maximumAge: 1000
		}
	});
};

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
	zone = zone.split('-')[0];

	if (carbonIntensity < 100) {
		// Good
		return (`The carbon intensity is looking good right now in the ${zone} zone. Keep up the good work.`);
	} else if (carbonIntensity > 100 && carbonIntensity < 250) {
		// Average
		return (`The carbon intensity is not quite perfect right now in the ${zone} zone. Mabye you should take the bus today`);
	} else {
		// Bad
		return (`The carbon intensity is not looking so good right now in the ${zone} zone. Mabye you should call your government 😉`);
	}
};

/**
 * This function determines which colour to render in the application based on
 * the passed through carbon intensity value. This is a simple case of using three
 * arbitrarily selected values. On a would choose the lower and upper limit, and then
 * interpolate the colours into a new spectrum, than can them be transitioned between.
 * @param	{number}	carbonIntensity	The current carbon intensity value
 * @returns	{string}					Returns the hex colour code
 */
export function determineColor(carbonIntensity) {
	if (carbonIntensity < 100) {
		// Good
		return (COLORS.BG_GOOD);
	} else if (carbonIntensity > 100 && carbonIntensity < 250) {
		// Average
		return (COLORS.BG_AVERAGE);
	} else {
		// Bad
		return (COLORS.BG_BAD);
	}
};
