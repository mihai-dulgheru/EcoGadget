import { ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Section } from '../components/RecyclingInfoDetailUser';
import global from '../styles/global';
import theme from '../styles/theme';

export default function RecyclingInfoDetailUserScreen({ route }) {
  const { recyclingInfo } = route.params;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.title}>{recyclingInfo.title}</Text>
      <Text style={styles.subtitle}>{recyclingInfo.subtitle}</Text>
      {recyclingInfo.location && (
        <View style={styles.mapContainer}>
          <MapView
            initialRegion={{
              latitude: recyclingInfo.location.latitude,
              longitude: recyclingInfo.location.longitude,
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
                latitude: recyclingInfo.location.latitude,
                longitude: recyclingInfo.location.longitude,
              }}
            />
          </MapView>
        </View>
      )}
      {recyclingInfo.sections.map((section) => (
        <Section key={section._id} section={section} />
      ))}
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
  title: {
    ...theme.fontSize['2xl'],
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.heading,
    marginBottom: theme.spacing[2],
  },
  subtitle: {
    ...theme.fontSize.lg,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily.body,
    marginBottom: theme.spacing[4],
  },
  mapContainer: {
    borderRadius: theme.borderRadius.md,
    height: theme.spacing[48],
    marginBottom: theme.spacing[4],
    overflow: 'hidden',
  },
  map: {
    // height: '100%',
    // width: '100%',
    ...StyleSheet.absoluteFillObject,
  },
});
