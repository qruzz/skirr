import * as COLORS from './colors';
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

export function determineMessage(carbonIntensity, zone) {
	zone = zone.split('-')[0];
	if (carbonIntensity < 100) {
		// Good
		return (`The corbon intensity is looking good right now in the ${zone} zone. Keep up the good work.`);
	} else if (carbonIntensity > 100 && carbonIntensity < 250) {
		// Average
		return (`The corbon intensity is not quite perfect right now in the ${zone} zone. Mabye you should take the bus today`);
	} else {
		// Bad
		return (`The corbon intensity is not looking so good right now in the ${zone} zone. Mabye you should call your government 😉`);
	}
};

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
