import {
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { ContactForm } from '../components';
import { Button } from '../components/UI';

function RecyclingCenterDetailsScreen({ route }) {
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
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: center.latitude,
            longitude: center.longitude,
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
              latitude: center.latitude,
              longitude: center.longitude,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
            title={center.name}
            description={center.address}
          />
        </MapView>
        <Button onPress={openInMaps}>Get Directions</Button>
        <Text style={styles.title}>{center.name}</Text>
        <Text style={styles.description}>{center.description}</Text>
        <Text style={styles.info}>
          Address:
          {center.address}
        </Text>
        <Text style={styles.info}>Schedule</Text>
        <View style={styles.scheduleContainer}>
          {Object.entries(center.schedule).map(([day, hours]) => (
            <Text style={styles.scheduleText} key={day}>
              {`${day.charAt(0).toUpperCase() + day.slice(1)}: ${hours}`}
            </Text>
          ))}
        </View>
        <Button onPress={openDialScreen}>Call Center</Button>
        <Text style={styles.info}>Contact Form</Text>
        <View style={styles.form}>
          <ContactForm centerId={center.id} />
        </View>
        <Text style={styles.info}>Other Information</Text>
        <Text style={styles.info}>
          Company:
          {center.company}
        </Text>
        <Text style={styles.info}>
          CUI:
          {center.cui}
        </Text>
        <Text style={styles.info}>
          Reg. Com:
          {center.regCom}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
  },
  scheduleContainer: {
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  scheduleText: {
    fontSize: 16,
    marginBottom: 5,
  },
  form: {
    width: '100%',
  },
});

export default RecyclingCenterDetailsScreen;
