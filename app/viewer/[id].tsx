import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { SharedApi, SonarrApi } from "radson";
import { useEffect } from 'react';
import axios from 'axios';

export default function ViewerScreen() {
	const { id } = useLocalSearchParams();

	useEffect(() => {
		(async () => {
			try {
				const sonarrAddress = await AsyncStorage.getItem("sonarrAddress") ?? ""
				const radarrAddress = await AsyncStorage.getItem("radarrAddress") ?? ""
				const sonarrApiKey = await SecureStore.getItemAsync("sonarrApiKey") ?? ""
				const radarrApiKey = await SecureStore.getItemAsync("radarrApiKey") ?? ""
				const sonarrApi = new SonarrApi({
					sonarr_addr: sonarrAddress,
					sonarr_api_key: sonarrApiKey
				})
				console.log(sonarrApiKey, sonarrAddress)
				const response = await axios.get("http://10.10.10.172:8989/api/v3" + "/lookup?term=tmdb:" + id, {
					headers: {
						"X-Api-Key": "3b0b523d29bc4df1baf30dbb2d5d6c48",
					},
				})
				// const response = await sonarrApi.series.lookup("tmdb:" + id)
				console.log(response)
				// const sharedApi = new SharedApi({
				// 	sonarr_addr: sonarrAddress,
				// 	radarr_addr: radarrAddress,
				// 	sonarr_api_key: sonarrApiKey,
				// 	radarr_api_key: radarrApiKey,
				// })
			} catch (err) {
				console.error(err)
			}
		})();
	}, [])

	return (
		<View style={styles.container}>
			<Text>Details of {id} </Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
