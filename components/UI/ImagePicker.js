import * as ExpoImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import theme from '../../styles/theme';
import Button from './Button';

export default function ImagePicker({ onImagePicked, initialImage, style }) {
  const [image, setImage] = useState(initialImage);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setImage(imageUri);
      onImagePicked(imageUri);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button title="Alege o imagine" onPress={pickImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    // width: 200,
    // height: 200,
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: theme.borderRadius.lg,
  },
});
