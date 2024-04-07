// import axios from 'axios';

// const BASE_URL = 'https://api.recycling.org/locations';

const getRecyclingLocations = async () => {
  try {
    // const response = await axios.get(`${BASE_URL}?query=electronics`);
    // return response.data;

    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });

    const mockResponse = {
      data: [
        {
          id: 1,
          name: 'Recycling Center 1',
          address: '123 Main St, YourCity',
          image: 'https://example.com/image1.jpg',
          schedule: '9:00 AM - 5:00 PM',
          distance: '2.5 km',
        },
        {
          id: 2,
          name: 'EcoFriendly Place',
          address: '456 Elm St, AnotherCity',
          image: 'https://example.com/image2.jpg',
          schedule: '10:00 AM - 6:00 PM',
          distance: '4.0 km',
        },
        {
          id: 3,
          name: 'Green Earth Facility',
          address: '789 Maple Ave, NearbyTown',
          image: 'https://example.com/image3.jpg',
          schedule: '8:00 AM - 4:00 PM',
          distance: '1.2 km',
        },
      ],
    };

    return mockResponse.data;
  } catch (error) {
    console.error('Failed to fetch recycling locations:', error);
    throw error;
  }
};

export default {
  getRecyclingLocations,
};
