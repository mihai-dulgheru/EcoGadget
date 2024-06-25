import Ionicons from '@expo/vector-icons/Ionicons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { isEmpty } from 'lodash';
import { useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  CustomAlert,
  Error,
  FlatButton,
  IconButton,
  ListEmptyComponent,
  Loading,
  Pill,
} from '../components/UI';
import { useRefreshByUser } from '../hooks/useRefreshByUser';
import { useRefreshOnFocus } from '../hooks/useRefreshOnFocus';
import ApplianceService from '../services/ApplianceService';
import global from '../styles/global';
import theme from '../styles/theme';
import { useAxiosAuth } from '../utils/Axios';

export default function ApplianceListUserScreen({ navigation }) {
  const AxiosAuth = useAxiosAuth();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertProps, setAlertProps] = useState({});

  const showAlert = (
    title,
    message,
    confirmText,
    onConfirm,
    cancelText,
    onCancel
  ) => {
    setAlertProps({
      title,
      message,
      confirmText,
      onConfirm,
      cancelText,
      onCancel,
    });
    setAlertVisible(true);
  };

  const {
    data: appliances,
    error,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ['appliances'],
    queryFn: async () => ApplianceService.getAppliances(AxiosAuth),
  });

  const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch);
  useRefreshOnFocus(refetch);

  const mutation = useMutation({
    mutationFn: async (id) => ApplianceService.deleteAppliance(AxiosAuth, id),
    onSuccess: () => refetch(),
    onError: (mutationError) => {
      console.error('Error deleting appliance:', mutationError);
      showAlert(
        'Eroare',
        'A apărut o eroare la ștergerea aparatului',
        'OK',
        () => setAlertVisible(false)
      );
    },
  });

  const handleAddButtonPress = () => {
    navigation.navigate('ApplianceEditUser', { appliance: {} });
  };

  const handleEdit = (appliance) => {
    navigation.navigate('ApplianceEditUser', { appliance });
  };

  const handleDelete = (id) => {
    showAlert(
      'Confirmă ștergerea',
      'Ești sigur că vrei să ștergi acest aparat?',
      'Șterge',
      async () => {
        await mutation.mutateAsync(id);
        setAlertVisible(false);
      },
      'Anulează',
      () => setAlertVisible(false)
    );
  };

  const handleStatistics = () => {
    navigation.navigate('ApplianceStatisticsUser');
  };

  if (isPending || mutation.isPending) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error.message} />;
  }

  return (
    <View style={global.flex1}>
      <View style={styles.addButton}>
        <IconButton
          color="white"
          icon="add"
          onPress={handleAddButtonPress}
          size={28}
        />
      </View>
      {appliances && !isEmpty(appliances) && (
        <View style={styles.toolbar}>
          <Pressable
            onPress={handleStatistics}
            style={({ pressed }) => [
              styles.statisticsButton,
              pressed && global.pressed,
            ]}
          >
            <View style={styles.statisticsContainer}>
              <Ionicons
                name="sparkles"
                size={24}
                color={theme.colors.primary}
              />
              <Text style={styles.primaryButtonText}>
                Generează statistici și recomandări
              </Text>
            </View>
          </Pressable>
        </View>
      )}
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={appliances}
        keyExtractor={(item) => item._id.toString()}
        ListEmptyComponent={ListEmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetchingByUser}
            onRefresh={refetchByUser}
          />
        }
        renderItem={({ item }) => (
          <Pressable onPress={() => handleEdit(item)}>
            <View style={styles.item}>
              <View style={styles.row}>
                <Text style={styles.title}>{item.name}</Text>
                <Pill color="green">{item.efficiencyRating}</Pill>
              </View>
              <Text style={styles.text}>
                {`Consum de energie: ${item.energyUsage} kWh/an`}
              </Text>
              <Text style={styles.text}>
                {`Emisii CO2: ${item.CO2Emissions} kg/an`}
              </Text>
              <View style={styles.actionButtons}>
                <View style={styles.buttonContainer}>
                  <FlatButton
                    extraStyles={{ buttonText: styles.buttonTextDelete }}
                    onPress={() => handleDelete(item._id)}
                    title="Șterge"
                  />
                </View>
                <View style={styles.buttonContainer}>
                  <FlatButton
                    extraStyles={{ buttonText: styles.buttonTextEdit }}
                    onPress={() => handleEdit(item)}
                    title="Editează"
                  />
                </View>
              </View>
            </View>
          </Pressable>
        )}
      />
      <CustomAlert visible={alertVisible} {...alertProps} />
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
    borderWidth: theme.borderWidth.default,
    bottom: theme.spacing[4],
    height: theme.spacing[14],
    justifyContent: 'center',
    padding: theme.spacing[1],
    position: 'absolute',
    right: theme.spacing[4],
    width: theme.spacing[14],
    zIndex: 1,
  },
  toolbar: {
    backgroundColor: theme.colors.backgroundPrimary,
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[4],
  },
  statisticsButton: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
  },
  statisticsContainer: {
    ...global.spacingSmall,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  primaryButtonText: {
    ...theme.fontSize.base,
    color: theme.colors.primary,
    fontFamily: theme.fontFamily.heading,
  },
  listContainer: {
    ...global.spacingMedium,
    backgroundColor: theme.colors.backgroundPrimary,
    flexGrow: 1,
    padding: theme.spacing[4],
  },
  item: {
    ...global.spacingSmall,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[2],
  },
  row: {
    ...global.spacingSmall,
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    ...theme.fontSize.lg,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.heading,
  },
  text: {
    ...theme.fontSize.base,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily.body,
  },
  actionButtons: {
    ...global.spacingSmall,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing[2],
  },
  buttonContainer: {
    width: '48%',
  },
  buttonTextDelete: {
    color: theme.colors.error,
  },
  buttonTextEdit: {
    color: theme.colors.primary,
  },
});
