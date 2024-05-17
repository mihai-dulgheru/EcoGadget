import Ionicons from '@expo/vector-icons/Ionicons';
import { forwardRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import theme from '../../styles/theme';

const Input = forwardRef(
  (
    {
      autoFocus = false,
      blurOnSubmit = true,
      isInvalid = false,
      keyboardType = 'default',
      label,
      multiline,
      numberOfLines,
      onBlur,
      onChangeText,
      onFocus,
      onSubmitEditing,
      placeholder,
      returnKeyType,
      secure = false,
      value,
    },
    ref
  ) => {
    const [secureTextEntry, setSecureTextEntry] = useState(secure);

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
            autoFocus={autoFocus}
            blurOnSubmit={blurOnSubmit}
            keyboardType={keyboardType}
            multiline={multiline}
            numberOfLines={numberOfLines}
            onBlur={onBlur}
            onChangeText={onChangeText}
            onFocus={onFocus}
            onSubmitEditing={onSubmitEditing}
            placeholder={placeholder}
            ref={ref}
            returnKeyType={returnKeyType}
            secureTextEntry={secureTextEntry}
            style={[styles.input, multiline && styles.textArea]}
            value={value}
          />
          {secure && (
            <TouchableOpacity
              onPress={() => setSecureTextEntry((prev) => !prev)}
              style={styles.icon}
            >
              <Ionicons
                color={theme.colors.textPrimary}
                name={secureTextEntry ? 'eye-off' : 'eye'}
                size={24}
              />
            </TouchableOpacity>
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
    marginBottom: theme.spacing['1'],
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
    justifyContent: 'center',
    minHeight: theme.spacing['12'],
    paddingHorizontal: theme.spacing['4'],
    paddingVertical: theme.spacing['2'],
    textAlignVertical: 'center',
  },
  inputInvalid: {
    borderColor: theme.colors.error,
  },
  textArea: {
    justifyContent: 'flex-start',
    maxHeight: theme.spacing['48'],
    minHeight: theme.spacing['24'],
    textAlignVertical: 'top',
  },
  icon: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing['4'],
    paddingVertical: theme.spacing['2'],
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
