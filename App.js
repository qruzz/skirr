import React from 'react';
import {
	StyleSheet,
	Text,
	View,
	Animated,
} from 'react-native';
import LottieView from 'lottie-react-native';
import Permissions from 'react-native-permissions';

import {
	getLocationData,
	determineMessage,
	determineColor,
} from './src/utils/functions';
import getLiveCarbonIntensity from './src/utils/api';
import * as CONST from './src/utils/consts';
import * as COLORS from './src/utils/colors';

const loader = require('./src/resources/world.json');

export default class App extends React.PureComponent {
	/**
	 * The constructor is taking care of initialising the state of the application with
	 * regard to the location data, animation values, and the carbon intensity values.
	 * @param	{object}	props	The parent props
	 * @returns	{void}
	 */
	constructor(props) {
		super(props);

		// The initial state
		this.state = {
			coords: null,
			carbonIntensityData: null,
			progress: new Animated.Value(0),
			opacity: new Animated.Value(0),
			loading: true,
			backgroundColor: new Animated.Value(0),
		};

		// The update interval for the timer
		this.UPDATE_INTERVAL = 5000;
	}

	/**
	 * This React lifecycle function takes care calls the initialisation function
	 * immediatly after the App Component has been mounted. This will initialise
	 * the state values and get the app ready for use.
	 * @returns	{void}
	 */
	componentDidMount() {
		Permissions.check('location').then((response) => {
			console.log(response);
			if (response) {
				this.init();
			}
		});
	}

	/**
	 * This function stops the loading animation and then starts the transition animations
	 * into the main view. It animates both the opacity of the content as well as the
	 * background colour of the main view.
	 * @returns	{void}
	 */
	endLoadingAnimation = () => {
		const { progress, opacity, backgroundColor } = this.state;

		// Stop the loading animation and start the transition to the main screen
		progress.stopAnimation(() => {
			this.setState({
				loading: false,
			}, () => {
				// Run opacity and background color animations in parallel
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
	 * This function initialises start the loading animation and then gets the location data
	 * from the GPS and sets it in state. After setting the location coordinates in state, it
	 * initialises the carbon intensity by making an initial call to the api function, setting
	 * the result in state. It then sets the fetching of location data to execute every
	 * UPDATE_INTERVAL ms. It will then start the transition to the display.
	 * @returns	{void}
	 */
	init = () => {
		const { progress } = this.state;

		// Start the loading animation
		Animated.timing(progress, {
			toValue: 1,
			duration: 4000,
		}).start();

		// Initialise the location data
		getLocationData().then((position) => {
			this.setState({
				coords: {
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				},
			}, () => {
				const { coords } = this.state;
				// Initialise the carbon intensity
				this.setCarbonIntensity(coords);

				// TODO: Uncomment for production
				// Update the carbon intensity after UDATE_INTERVAL ms
				// setInterval(this.setCarbonIntensity, this.UPDATE_INTERVAL);

				// Let the animation complete before transitioning
				setTimeout(() => {
					this.endLoadingAnimation();
				}, 4000);
			});
		});
	}

	/**
	 * This function calls the API to GET the live carbon intensity in the zone corresponding to
	 * the location data set in state. It then stores the response from the API in state.
	 * @returns	{void}
	 */
	setCarbonIntensity = () => {
		const { coords } = this.state;
		// GET the live carbon intensity from the current zone
		getLiveCarbonIntensity(coords).then((result) => {
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

	/**
	 * This function starts off by returning a loading animation to be rendered on in the main view.
	 * When the state properties states that it is no longer loading, and the carbon intensity data
	 * has been set, the function will return an animated view. The view gets its opacity animated
	 * from 0 to 1, and its background colour gets animated from BG_COLOR to the one returned
	 * by the helper function determineColor.
	 * @returns	{jsx}	The Main View
	 */
	renderMainView = () => {
		const {
			loading,
			progress,
			opacity,
			carbonIntensityData,
		} = this.state;

		// If it is no longer loading, and the carbon intensity data has been set in state
		if (!loading && carbonIntensityData) {
			return (
				<Animated.View
					style={[
						styles.centeredContainer,
						{
							opacity,
							backgroundColor: determineColor(carbonIntensityData.carbonIntensity),
						},
					]}
				>
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

	/**
	 * The React render functions takes care of rendering the application
	 * @returns	{jsx}	The App component
	 */
	render() {
		return (
			<View style={styles.container}>
				{this.renderMainView()}
			</View>
		);
	}
}

// Styles for the App Component
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
