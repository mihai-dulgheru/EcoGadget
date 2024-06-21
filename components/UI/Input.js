import Ionicons from '@expo/vector-icons/Ionicons';
import { forwardRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import global from '../../styles/global';
import theme from '../../styles/theme';

const Input = forwardRef(
  (
    {
      isInvalid = false,
      label = '',
      multiline = false,
      secure = false,
      ...props
    },
    ref
  ) => {
    const [secureTextEntry, setSecureTextEntry] = useState(secure);

    const handleSecureTextEntryToggle = (event) => {
      event.preventDefault();
      event.stopPropagation();
      setSecureTextEntry((prev) => !prev);
    };

    return (
      <View>
        {label && (
          <Text style={[styles.label, isInvalid && styles.labelInvalid]}>
            {label}
          </Text>
        )}
        <View style={[styles.inputSection, isInvalid && styles.inputInvalid]}>
          <TextInput
            autoCapitalize="none"
            multiline={multiline}
            placeholderTextColor={theme.colors.textSecondary}
            ref={ref}
            secureTextEntry={secureTextEntry}
            style={[styles.input, multiline && styles.textArea]}
            {...props}
          />
          {secure && (
            <Pressable
              onPress={handleSecureTextEntryToggle}
              style={({ pressed }) => [styles.icon, pressed && global.pressed]}
            >
              <Ionicons
                color={theme.colors.textPrimary}
                name={secureTextEntry ? 'eye-off' : 'eye'}
                size={24}
              />
            </Pressable>
          )}
        </View>
      </View>
    );
  }
);

export default Input;

const styles = StyleSheet.create({
  label: {
    ...theme.fontSize.sm,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.body,
    marginBottom: theme.spacing[1],
  },
  labelInvalid: {
    color: theme.colors.error,
  },
  inputSection: {
    backgroundColor: theme.colors.backgroundPrimary,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    borderWidth: theme.borderWidth.default,
    overflow: 'hidden',
  },
  input: {
    ...theme.fontSize.base,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.body,
    justifyContent: 'center',
    minHeight: theme.spacing[12],
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
    textAlignVertical: 'center',
  },
  inputInvalid: {
    borderColor: theme.colors.error,
  },
  textArea: {
    justifyContent: 'flex-start',
    maxHeight: theme.spacing[48],
    minHeight: theme.spacing[24],
    textAlignVertical: 'top',
  },
  icon: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
