import axios from 'axios';
import { calculateDistance } from '../utils/GeoUtils';

const getRecyclingLocations = async (coords) => {
  try {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    const response = await axios.get(`${apiUrl}/recycling-locations`);
    const locations = response.data;

    return locations.data
      .map((location) => ({
        ...location,
        distance: calculateDistance(
          coords.latitude,
          coords.longitude,
          location.latitude,
          location.longitude
        ),
      }))
      .sort((a, b) => a.distance - b.distance)
      .map((location) => ({
        ...location,
        distance: `${location.distance.toFixed(2)} km`,
      }));
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else if (error.request) {
      throw new Error('No response from the server');
    } else {
      throw new Error('An error occurred');
    }
  }
};

export default {
  getRecyclingLocations,
};
