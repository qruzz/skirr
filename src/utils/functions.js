
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