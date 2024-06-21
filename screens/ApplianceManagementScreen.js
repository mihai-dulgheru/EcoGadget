import Ionicons from '@expo/vector-icons/Ionicons';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  Button,
  CustomAlert,
  Error,
  FlatButton,
  IconButton,
  ListEmptyComponent,
  Loading,
  Pill,
} from '../components/UI';
import ApplianceService from '../services/ApplianceService';
import global from '../styles/global';
import theme from '../styles/theme';
import { useAxiosAuth } from '../utils/Axios';

export default function ApplianceManagementScreen({ navigation, route }) {
  const { dataUpdatedAt } = route.params || {};
  const [appliances, setAppliances] = useState([]);
  const [status, setStatus] = useState('loading');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertProps, setAlertProps] = useState({});
  const AxiosAuth = useAxiosAuth();

  async function fetchAppliances() {
    try {
      setStatus('loading');
      const data = await ApplianceService.getAppliances(AxiosAuth);
      setAppliances(data);
      setStatus('success');
    } catch (error) {
      console.error('Error loading appliances:', error);
      setStatus('error');
    }
  }

  useEffect(() => {
    fetchAppliances();
  }, [dataUpdatedAt]);

  const handleAddButtonPress = () => {
    navigation.navigate('ApplianceEdit', { appliance: {} });
  };

  const handleEdit = (appliance) => {
    navigation.navigate('ApplianceEdit', { appliance });
  };

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

  const handleDelete = async (id) => {
    showAlert(
      'Confirmă ștergerea',
      'Ești sigur că vrei să ștergi acest aparat?',
      'Șterge',
      async () => {
        try {
          setAlertVisible(false);
          setStatus('loading');
          await ApplianceService.deleteAppliance(AxiosAuth, id);
          await fetchAppliances();
          setStatus('success');
        } catch (error) {
          console.error('Error deleting appliance:', error);
          setStatus('error');
        }
      },
      'Anulează',
      () => setAlertVisible(false)
    );
  };

  const handleStatistics = async () => {
    navigation.navigate('ApplianceStatistics');
  };

  if (status === 'loading') {
    return <Loading />;
  }

  if (status === 'error') {
    return (
      <Error message="A apărut o eroare la încărcarea informațiilor despre aparate" />
    );
  }

  return (
    <View style={styles.container}>
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
                  <Button
                    title="Editează"
                    color="secondary"
                    onPress={() => handleEdit(item)}
                  />
                </View>
                <View style={styles.buttonContainer}>
                  <FlatButton
                    extraStyles={{ buttonText: styles.buttonTextDelete }}
                    onPress={() => handleDelete(item._id)}
                    title="Șterge"
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
  container: {
    flex: 1,
  },
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
    ...theme.fontSize.sm,
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
});
