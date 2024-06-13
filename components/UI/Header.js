import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import theme from '../../styles/theme';

export default function Header({ title, canGoBack }) {
  const navigation = useNavigation();

  return (
    <View style={[styles.container, canGoBack && styles.containerWithBack]}>
      {canGoBack && (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.colors.textPrimary}
          />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundPrimary,
    flexDirection: 'row',
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[2],
  },
  containerWithBack: {
    gap: theme.spacing[1.5],
    paddingLeft: theme.spacing[1.5],
  },
  backButton: {
    padding: theme.spacing[2],
  },
  title: {
    ...theme.fontSize['2xl'],
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.heading,
    paddingVertical: theme.spacing[2],
  },
});
