import { ScrollView, StyleSheet, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Section } from '../components/RecyclingInfoDetails';
import theme from '../styles/theme';

export default function RecyclingInfoDetailsScreen({ route }) {
  const { recyclingInfo } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{recyclingInfo.title}</Text>
      <Text style={styles.subtitle}>{recyclingInfo.subtitle}</Text>
      {recyclingInfo.location && (
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
      )}
      {recyclingInfo.sections.map((section) => (
        <Section key={section._id} section={section} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing['4'],
  },
  title: {
    ...theme.fontSize.xl,
    fontWeight: 'bold',
    marginBottom: theme.spacing['2'],
    marginTop: theme.spacing['4'],
  },
  subtitle: {
    ...theme.fontSize.lg,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing['6'],
  },
  map: {
    height: theme.spacing['48'],
    marginBottom: theme.spacing['4'],
    width: '100%',
  },
});
