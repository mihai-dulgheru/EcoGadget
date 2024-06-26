import { ResizeMode, Video } from 'expo-av';
import { useRef } from 'react';
import { Image, Linking, StyleSheet, Text, View } from 'react-native';
import global from '../../styles/global';
import theme from '../../styles/theme';
import FAQList from './FAQList';
import SocialLinks from './SocialLinks';

export default function Section({ section }) {
  const video = useRef(null);

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
        <View style={styles.videoContainer}>
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
        </View>
      )}
      {section.links && section.links.length > 0 && (
        <View style={styles.container}>
          <Text style={styles.heading}>Linkuri utile</Text>
          <View>
            {section.links.map((link) => (
              <Text
                key={link._id}
                style={[styles.content, styles.link]}
                onPress={() => Linking.openURL(link.url)}
              >
                {link.title}
              </Text>
            ))}
          </View>
        </View>
      )}
      {section.contact && (
        <View style={styles.container}>
          <Text style={styles.heading}>Contact</Text>
          <View>
            <Text style={[styles.content, styles.contact]}>
              {section.contact.address}
            </Text>
            <Text style={[styles.content, styles.contact]}>
              {section.contact.email}
            </Text>
            <Text
              style={[styles.content, styles.contact]}
              onPress={() => Linking.openURL(`tel:${section.contact.phone}`)}
            >
              {section.contact.phone}
            </Text>
          </View>
        </View>
      )}
      {section.social && <SocialLinks links={section.social} />}
      {section.faqs && <FAQList faqs={section.faqs} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...global.spacingMedium,
  },
  heading: {
    ...theme.fontSize.lg,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.heading,
  },
  content: {
    ...theme.fontSize.base,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.body,
  },
  image: {
    borderRadius: theme.borderRadius.md,
    height: theme.spacing[48],
    width: '100%',
  },
  videoContainer: {
    borderRadius: theme.borderRadius.md,
    height: theme.spacing[48],
    overflow: 'hidden',
  },
  video: {
    height: '100%',
    width: '100%',
  },
  link: {
    color: theme.colors.primary,
  },
});
