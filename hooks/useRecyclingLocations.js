import { useQuery } from '@tanstack/react-query';
import * as Location from 'expo-location';
import { useState } from 'react';
import RecyclingService from '../services/RecyclingService';

export const useRecyclingLocations = (isSearching, searchText) => {
  const [currentPosition, setCurrentPosition] = useState(null);

  const {
    data: locations,
    error,
    isPending,
  } = useQuery({
    queryKey: ['recyclingLocations'],
    queryFn: async () => {
      const permissionResponse =
        await Location.requestForegroundPermissionsAsync();
      if (permissionResponse?.status !== 'granted') {
        throw new Error('Permission to access location was denied');
      }
      const location = await Location.getCurrentPositionAsync({});
      setCurrentPosition(location);
      return RecyclingService.getRecyclingLocations(location.coords);
    },
  });

  const {
    data: searchResults,
    error: searchError,
    isError: isSearchError,
    isPending: isSearchingPending,
    isSuccess: isSearchSuccess,
  } = useQuery({
    queryKey: ['searchRecyclingLocations', searchText],
    queryFn: async () => {
      const permissionResponse =
        await Location.requestForegroundPermissionsAsync();
      if (permissionResponse?.status !== 'granted') {
        throw new Error('Permission to access location was denied');
      }
      const location = await Location.getCurrentPositionAsync({});
      return RecyclingService.searchRecyclingLocations(
        location.coords,
        searchText
      );
    },
  });

  return {
    currentPosition,
    locations,
    error,
    isPending,
    searchResults,
    searchError,
    isSearchError,
    isSearchingPending,
    isSearchSuccess,
  };
};
