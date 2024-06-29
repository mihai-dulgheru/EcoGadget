import Constants from 'expo-constants';

class Geocoder {
  static apiKey = Constants.expoConfig.android.config.googleMaps.apiKey;

  static async from(address) {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${Geocoder.apiKey}`
    );
    const data = await response.json();
    return data;
  }
}

export default Geocoder;
