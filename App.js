import React from 'react';
import {
	StyleSheet,
	Text,
	View,
	Animated,
} from 'react-native';
import LottieView from 'lottie-react-native';

import {
	getLocationData,
	determineMessage,
	determineColor
} from './src/utils/functions';
import { getLiveCarbonIntensity } from './src/utils/api';
import * as CONST from './src/utils/consts';
import * as COLORS from './src/utils/colors';

const loader = require('./src/resources/world.json');

export default class App extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			coords: null,
			carbonIntensityData: null,
			progress: new Animated.Value(0),
			opacity: new Animated.Value(0),
			loading: true,
			backgroundColor: new Animated.Value(0),
		}

		// The update interval for the timer
		this.UPDATE_INTERVAL = 5000;
	}

	componentDidMount() {
		this.init();
	}

	playLoadingAnimation = () => {
		const { progress } = this.state;
		Animated.timing(progress, {
			toValue: 1,
			duration: 4000,
		}).start();
	}

	pauseLoadingAnimation = () => {
		const { progress, opacity, backgroundColor } = this.state;
		progress.stopAnimation(() => {
			this.setState({
				loading: false,
			}, () => {
				Animated.parallel([
					Animated.timing(opacity, {
						toValue: 1,
						duration: 1000,
					}),
					Animated.timing(backgroundColor, {
						toValue: 1,
						duration: 1000,
					}),
				]).start();
			});
		});
	}

	/**
	 * This function initialises the location data from the GPS and sets it in state.
	 * After setting the location coordinates in state, it initialises the carbon intensity
	 * by making an initial call to the api function, setting the result in state. It then
	 * sets the fetching of location data to execute every UPDATE_INTERVAL ms
	 * @returns	{void}
	 */
	init = () => {
		this.playLoadingAnimation();

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
				// setInterval(this.setCarbonIntensity, this.UPDATE_INTERVAL);

				setTimeout(() => {
					this.pauseLoadingAnimation();
				}, 4000);
			});
		});
	}

	/**
	 * 
	 * @returns	{void}
	 */
	setCarbonIntensity = () => {
		// GET the live carbon intensity from the current zone
		getLiveCarbonIntensity(this.state.coords).then((result) => {
			if (!result.error) {
				this.setState({
					carbonIntensityData: {
						zone: result.zone,
						carbonIntensity: result.carbonIntensity,
					},
				});
			}
		});
	}

	renderMainView = () => {
		const { loading, progress, opacity, carbonIntensityData } = this.state;
		if (!loading && carbonIntensityData) {
			return (
				<Animated.View
					style={[
						styles.centeredContainer,
						{
							opacity: opacity,
							backgroundColor: determineColor(carbonIntensityData.carbonIntensity),
						},
					]}>
					<View style={styles.centerCircle}>
						<Text style={styles.carbonIntensity}>
							{carbonIntensityData.carbonIntensity}
						</Text>
					</View>
					<View style={styles.absoluteMessageContainer}>
						<Text style={styles.absoluteMessage}>
							{determineMessage(carbonIntensityData.carbonIntensity, carbonIntensityData.zone)}
						</Text>
					</View>
				</Animated.View>
			);
		}

		return (
			<LottieView
				progress={progress}
				source={loader}
				style={{
					width: CONST.WIDTH,
				}}
			/>
		);
	}

	render() {
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
		backgroundColor: COLORS.BG_COLOR,
	},
	animatedLayer: {
		height: CONST.HEIGHT,
	},
	centeredContainer: {
		width: CONST.WIDTH,
		height: CONST.HEIGHT,
		alignItems: 'center',
		justifyContent: 'center',
	},
	centerCircle: {
		width: CONST.HEIGHT * 0.19,
		height: CONST.HEIGHT * 0.19,
		borderRadius: (CONST.HEIGHT * 0.19) / 2,
		borderWidth: CONST.HEIGHT * 0.007,
		borderColor: COLORS.WHITE,
		alignItems: 'center',
		justifyContent: 'center',
	},
	carbonIntensity: {
		fontSize: CONST.HEIGHT * 0.06,
		fontWeight: '500',
		color: COLORS.WHITE,
	},
	absoluteMessageContainer: {
		width: CONST.WIDTH,
		position: 'absolute',
		bottom: CONST.HEIGHT * 0.2,
		alignItems: 'center',
	},
	absoluteMessage: {
		width: '80%',
		color: COLORS.WHITE,
		textAlign: 'center',
		fontSize: CONST.HEIGHT * 0.02,
		fontStyle: 'italic',
	},
});
