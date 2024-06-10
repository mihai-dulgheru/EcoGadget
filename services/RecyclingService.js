import * as FileSystem from 'expo-file-system';
import { Axios } from '../utils/Axios';
import { calculateDistance } from '../utils/GeoUtils';

async function addRecyclingLocation(axiosInstance, values) {
  try {
    const { image, ...rest } = values;
    const response = await FileSystem.uploadAsync(
      `${axiosInstance.defaults.baseURL}/recycling-manager/recycling-locations`,
      values.image,
      {
        headers: {
          authorization: axiosInstance.defaults.headers.Authorization,
        },
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: 'image',
        parameters: {
          formData: JSON.stringify(rest),
        },
      }
    );
    if (response.status !== 201) {
      throw new Error('An error occurred');
    }
    return response.body;
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

async function updateRecyclingLocation(axiosInstance, id, values) {
  try {
    const response = await axiosInstance.put(
      `/recycling-manager/recycling-locations/${id}`,
      values
    );
    return response.data;
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
  addRecyclingLocation,
  getRecyclingLocations,
  updateRecyclingLocation,
};
