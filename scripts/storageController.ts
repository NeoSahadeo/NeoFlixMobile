import AsyncStorage from "@react-native-async-storage/async-storage";

// To store data
const storeData = async (key: string, value: string) => {
	try {
		await AsyncStorage.setItem(key, value);
	} catch (e) {
		console.error("Error saving data", e);
	}
};

// To read data
const getData = async (key: string) => {
	try {
		const value = await AsyncStorage.getItem(key);
		if (value !== null) {
			// use the retrieved value
			console.log(value);
		}
	} catch (e) {
		console.error("Error reading value", e);
	}
};

export { getData, storeData };
