// import axios from 'axios';

import { calculateDistance } from '../utils/GeoUtils';

// const BASE_URL = 'https://api.recycling.org/locations';

const getRecyclingLocations = async (coords) => {
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
          image:
            'https://sustainability.gsu.edu/files/2022/07/Recycling-Center-Commons.jpg',
          phone: '+1234567890',
          description:
            'This is a state-of-the-art facility that specializes in recycling electronics and hazardous materials.',
          schedule: {
            monday: '9:00 AM - 5:00 PM',
            tuesday: '9:00 AM - 5:00 PM',
            wednesday: '9:00 AM - 5:00 PM',
            thursday: '9:00 AM - 5:00 PM',
            friday: '9:00 AM - 5:00 PM',
            saturday: '10:00 AM - 2:00 PM',
            sunday: 'Closed',
          },
          company: 'EcoRecycle Inc.',
          cui: 'RO12345678',
          regCom: 'J12/3456/2009',
          latitude: 44.43301523279083,
          longitude: 26.040600654474453,
        },
        {
          id: 2,
          name: 'EcoFriendly Place',
          address: '456 Elm St, AnotherCity',
          image:
            'https://theroundup.org/wp-content/uploads/2022/06/how-recycling-centers-make-money.jpg',
          phone: '+0987654321',
          description:
            'Dedicated to making the world a better place by recycling plastics and paper products.',
          schedule: {
            monday: '9:00 AM - 5:00 PM',
            tuesday: '9:00 AM - 5:00 PM',
            wednesday: '9:00 AM - 5:00 PM',
            thursday: '9:00 AM - 5:00 PM',
            friday: '9:00 AM - 5:00 PM',
            saturday: '10:00 AM - 2:00 PM',
            sunday: 'Closed',
          },
          company: 'GreenWorld Solutions',
          cui: 'RO87654321',
          regCom: 'J21/6543/2010',
          latitude: 44.43301523279083,
          longitude: 26.040600654474453,
        },
        {
          id: 3,
          name: 'Green Earth Facility',
          address: '789 Maple Ave, NearbyTown',
          image: 'https://example.com/image3.jpg',
          phone: '+1029384756',
          description:
            'Your go-to facility for all organic waste recycling needs.',
          schedule: {
            monday: '9:00 AM - 5:00 PM',
            tuesday: '9:00 AM - 5:00 PM',
            wednesday: '9:00 AM - 5:00 PM',
            thursday: '9:00 AM - 5:00 PM',
            friday: '9:00 AM - 5:00 PM',
            saturday: '10:00 AM - 2:00 PM',
            sunday: 'Closed',
          },
          company: 'Organix Recycling',
          cui: 'RO21436587',
          regCom: 'J34/5678/2011',
          latitude: 44.43301523279083,
          longitude: 26.040600654474453,
        },
      ],
    };

    return mockResponse.data
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
    console.error('Failed to fetch recycling locations:', error);
    throw error;
  }
};

export default {
  getRecyclingLocations,
};
