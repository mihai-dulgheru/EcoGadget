import { Axios } from '../utils/Axios';
import { calculateDistance } from '../utils/GeoUtils';

async function getRecyclingLocations(coords) {
  try {
    const response = await Axios.get('/recycling-locations');
    return response.data
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
}

export default {
  getRecyclingLocations,
};
