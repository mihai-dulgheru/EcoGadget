import { ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Section } from '../components/RecyclingInfoDetails';
import theme from '../styles/theme';

export default function RecyclingInfoDetailsScreen({ route }) {
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
            style={styles.map}
            initialRegion={{
              latitude: recyclingInfo.location.latitude,
              longitude: recyclingInfo.location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
          >
            <Marker
              coordinate={{
                latitude: recyclingInfo.location.latitude,
                longitude: recyclingInfo.location.longitude,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
              rotateEnabled={false}
              pitchEnabled={false}
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
    gap: theme.spacing['4'],
    padding: theme.spacing['4'],
  },
  title: {
    ...theme.fontSize.xl,
    fontWeight: 'bold',
  },
  subtitle: {
    ...theme.fontSize.lg,
    color: theme.colors.textSecondary,
  },
  mapContainer: {
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  map: {
    height: theme.spacing['48'],
    width: '100%',
  },
});
