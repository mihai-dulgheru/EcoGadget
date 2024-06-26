import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { ContactForm } from '../components/Forms';
import { Button } from '../components/UI';
import { WEEKDAY_TRANSLATIONS } from '../constants';
import global from '../styles/global';
import theme from '../styles/theme';

export default function RecyclingCenterDetailUserScreen({ route }) {
  const { center } = route.params;

  const openInMaps = () => {
    const url = Platform.select({
      ios: `maps:0,0?q=${center.latitude},${center.longitude}`,
      android: `geo:0,0?q=${center.latitude},${center.longitude}(${center.name})`,
    });
    Linking.openURL(url);
  };

  const openDialScreen = () => {
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${center.phone}`;
    } else {
      phoneNumber = `telprompt:${center.phone}`;
    }
    Linking.openURL(phoneNumber);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.mapContainer}>
        <MapView
          initialRegion={{
            latitude: center.latitude,
            longitude: center.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          // pitchEnabled={false}
          // rotateEnabled={false}
          // scrollEnabled={false}
          // zoomEnabled={false}
        >
          <Marker
            coordinate={{
              latitude: center.latitude,
              longitude: center.longitude,
            }}
          />
        </MapView>
      </View>
      <Button title="Deschide în Maps" onPress={openInMaps} />
      <Text style={styles.title}>{center.name}</Text>
      <Text style={styles.description}>{center.description}</Text>
      <Text style={styles.info}>
        {'Adresa: '}
        {center.address}
      </Text>
      <Text style={styles.heading}>Program</Text>
      <View>
        {Object.entries(center.schedule).map(([day, timeSchedule]) => (
          <Text style={styles.schedule} key={day}>
            {`${WEEKDAY_TRANSLATIONS[day]}: ${timeSchedule === 'Closed' ? 'Închis' : timeSchedule}`}
          </Text>
        ))}
      </View>
      <Button title={`Sună la ${center.phone}`} onPress={openDialScreen} />
      <Text style={styles.heading}>Contact</Text>
      <ContactForm locationId={center._id} />
      <Text style={styles.heading}>Informații companie</Text>
      <View>
        <Text style={styles.info}>
          {'Denumire: '}
          {center.company}
        </Text>
        <Text style={styles.info}>
          {'CUI: '}
          {center.cui}
        </Text>
        <Text style={styles.info}>
          {'Reg. Com: '}
          {center.regCom}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.backgroundPrimary,
    flex: 1,
  },
  contentContainer: {
    ...global.spacingMedium,
    padding: theme.spacing[4],
  },
  mapContainer: {
    borderRadius: theme.borderRadius.md,
    height: theme.spacing[48],
    overflow: 'hidden',
  },
  map: {
    height: '100%',
    width: '100%',
  },
  title: {
    ...theme.fontSize.xl,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.heading,
    marginTop: theme.spacing[2],
  },
  description: {
    ...theme.fontSize.base,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.body,
  },
  info: {
    ...theme.fontSize.base,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.body,
  },
  heading: {
    ...theme.fontSize.lg,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.heading,
  },
  schedule: {
    ...theme.fontSize.base,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.body,
  },
});
