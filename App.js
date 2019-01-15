import React from 'react';
import {
	StyleSheet,
	Text,
	View,
	ActivityIndicator,
} from 'react-native';

import { getLiveCarbonIntensity } from './src/utils/api';
import { getLocationData } from './src/utils/functions';

export default class App extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			color: '#FFFFFF',
			coords: null,
			carbonIntensityData: null,
		}

		// The update interval for the timer
		this.UPDATE_INTERVAL = 5000;
	}

	componentDidMount() {
		this.init();
	}

	init = () => {
		// Initialise the location data
		getLocationData().then((position) => {
			this.setState({
				coords: {
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				}
			}, () => {
				// Initialise the carbon intensity
				this.setCarbonIntensity(this.state.coords);

				// Update the carbon intensity after UDATE_INTERVAL ms
				setInterval(this.setCarbonIntensity, this.UPDATE_INTERVAL);
			});
		});
	}

	setCarbonIntensity = () => {
		getLiveCarbonIntensity(this.state.coords).then((result) => {
			if (result.error) {
				return (null);
			}

			this.setState({
				carbonIntensityData: {
					zone: result.zone,
					carbonIntensity: result.carbonIntensity,
				},
			});
		});
	}

	renderMainView = () => {
		const { coords } = this.state;
		if (coords) {
			return (
				<View>
					<Text>HI</Text>
				</View>
			);
		}

		return (
			<ActivityIndicator size={"large"} />
		);
	}

	render() {
		// console.log(process.env);
		console.log(this.state);
		const { color } = this.state;
		return (
			<View style={styles.container}>
				{this.renderMainView()}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
	},
	welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
	},
	instructions: {
		textAlign: 'center',
		color: '#333333',
		marginBottom: 5,
	},
});
