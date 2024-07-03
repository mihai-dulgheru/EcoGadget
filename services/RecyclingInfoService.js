import * as FileSystem from 'expo-file-system';
import { Axios } from '../utils/Axios';
import { hasImageChanged } from '../utils/ImagePicker';

async function addRecyclingInfo(axiosInstance, values) {
  try {
    const { picture, ...rest } = values;
    const response = await FileSystem.uploadAsync(
      `${axiosInstance.defaults.baseURL}/admin/recycling-info`,
      values.picture,
      {
        headers: {
          authorization: axiosInstance.defaults.headers.Authorization,
        },
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: 'picture',
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

async function deleteRecyclingInfo(axiosInstance, id) {
  try {
    const response = await axiosInstance.delete(`/admin/recycling-info/${id}`);
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

async function getRecyclingInfo() {
  try {
    const response = await Axios.get('/recycling-info');
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

async function getRecyclingInfoById(axiosInstance, id) {
  try {
    const response = await axiosInstance.get(`/admin/recycling-info/${id}`);
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

async function getRecyclingInfos(axiosInstance) {
  try {
    const response = await axiosInstance.get('/admin/recycling-info');
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

async function updateRecyclingInfo(axiosInstance, id, values) {
  try {
    const { picture, ...rest } = values;
    if (hasImageChanged(picture)) {
      const response = await FileSystem.uploadAsync(
        `${axiosInstance.defaults.baseURL}/admin/recycling-info/${id}`,
        picture,
        {
          headers: {
            authorization: axiosInstance.defaults.headers.Authorization,
          },
          httpMethod: 'PUT',
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          fieldName: 'picture',
          parameters: {
            formData: JSON.stringify(rest),
          },
        }
      );
      if (response.status !== 200) {
        throw new Error('An error occurred');
      }
      return response.body;
    }

    const response = await axiosInstance.put(
      `/admin/recycling-info/${id}`,
      {
        formData: JSON.stringify(rest),
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    if (response.status !== 200) {
      throw new Error('An error occurred');
    }
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
  addRecyclingInfo,
  deleteRecyclingInfo,
  getRecyclingInfo,
  getRecyclingInfoById,
  getRecyclingInfos,
  updateRecyclingInfo,
};
