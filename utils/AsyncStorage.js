import AsyncStorage from '@react-native-async-storage/async-storage';

async function setItem(key, value) {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    throw new Error('Error storing data');
  }
}

async function getItem(key) {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    throw new Error('Error getting data');
  }
}

async function removeItem(key) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    throw new Error('Error removing data');
  }
}

export default { getItem, removeItem, setItem };
