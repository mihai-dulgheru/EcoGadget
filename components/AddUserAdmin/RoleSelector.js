import { useField } from 'formik';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../../styles/theme';

export default function RoleSelector() {
  const [field, , helpers] = useField('role');
  const { value } = field;
  const { setValue } = helpers;

  return (
    <View style={styles.roleContainer}>
      <Pressable
        onPress={() => setValue('user')}
        style={[
          styles.roleButton,
          value === 'user' && styles.roleButtonSelected,
        ]}
      >
        <Text
          style={[
            styles.roleButtonText,
            value === 'user' && styles.roleButtonTextSelected,
          ]}
        >
          Utilizator
        </Text>
      </Pressable>
      <Pressable
        onPress={() => setValue('recycling_manager')}
        style={[
          styles.roleButton,
          value === 'recycling_manager' && styles.roleButtonSelected,
        ]}
      >
        <Text
          style={[
            styles.roleButtonText,
            value === 'recycling_manager' && styles.roleButtonTextSelected,
          ]}
        >
          Manager
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  roleContainer: {
    flexDirection: 'row',
    gap: theme.spacing[2],
  },
  roleButton: {
    alignItems: 'center',
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    flex: 1,
    padding: theme.spacing[2],
  },
  roleButtonSelected: {
    backgroundColor: theme.colors.primary,
  },
  roleButtonText: {
    ...theme.fontSize.base,
    color: theme.colors.primary,
    fontFamily: theme.fontFamily.body,
  },
  roleButtonTextSelected: {
    color: 'white',
  },
});
