import { ResizeMode, Video } from 'expo-av';
import * as React from 'react';
import { Image, Linking, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import theme from '../../styles/theme';
import FAQList from './FAQList';
import SocialLinks from './SocialLinks';

export default function Section({ section }) {
  const video = React.useRef(null);

  return (
    <View style={styles.container}>
      {section.heading && <Text style={styles.heading}>{section.heading}</Text>}
      {section.content && <Text style={styles.content}>{section.content}</Text>}
      {section.images &&
        section.images.map((image) => (
          <Image
            key={image._id}
            style={styles.image}
            source={{ uri: image.url }}
            alt={image.alt}
          />
        ))}
      {section.video && (
        <Video
          ref={video}
          style={styles.video}
          source={{
            uri: section.video.url,
          }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping
        />
      )}
      {section.map && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: section.map.latitude,
            longitude: section.map.longitude,
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
              latitude: section.map.latitude,
              longitude: section.map.longitude,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
          />
        </MapView>
      )}
      {section.links &&
        section.links.map((link) => (
          <Text
            key={link._id}
            style={styles.link}
            onPress={() => Linking.openURL(link.url)}
          >
            {link.title}
          </Text>
        ))}
      {section.contact && (
        <View>
          <Text>{section.contact.address}</Text>
          <Text>{section.contact.email}</Text>
          <Text onPress={() => Linking.openURL(`tel:${section.contact.phone}`)}>
            {section.contact.phone}
          </Text>
        </View>
      )}
      {section.social && <SocialLinks links={section.social} />}
      {section.faqs && <FAQList faqs={section.faqs} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  heading: {
    ...theme.fontSize.lg,
    fontWeight: 'bold',
    marginBottom: theme.spacing['4'],
  },
  content: {},
  image: {
    height: theme.spacing['48'],
    marginBottom: theme.spacing['4'],
    width: '100%',
  },
  video: {
    height: theme.spacing['48'],
    width: '100%',
  },
  map: {
    height: theme.spacing['48'],
    marginBottom: theme.spacing['4'],
    width: '100%',
  },
  link: {
    color: 'blue',
    marginBottom: theme.spacing['4'],
  },
});
