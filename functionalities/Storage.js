import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveData = async () => {
  try {
    await AsyncStorage.setItem("key", "value");
    console.log("Data saved successfully.");
  } catch (error) {
    console.log("Error saving data:", error);
  }
};

const retrieveData = async () => {
  try {
    const value = await AsyncStorage.getItem("key");
    if (value !== null) {
      console.log("Retrieved value:", value);
    }
  } catch (error) {
    console.log("Error retrieving data:", error);
  }
};
