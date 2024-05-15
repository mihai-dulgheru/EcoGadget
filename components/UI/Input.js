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
      isInvalid,
      keyboardType = 'default',
      label,
      multiline,
      numberOfLines,
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
      <View style={styles.inputContainer}>
        <Text style={[styles.label, isInvalid && styles.labelInvalid]}>
          {label}
        </Text>
        <View style={styles.inputSection}>
          <TextInput
            autoCapitalize="none"
            autoFocus={autoFocus}
            blurOnSubmit={blurOnSubmit}
            keyboardType={keyboardType}
            multiline={multiline}
            numberOfLines={numberOfLines}
            onChangeText={onChangeText}
            onFocus={onFocus}
            onSubmitEditing={onSubmitEditing}
            placeholder={placeholder}
            ref={ref}
            returnKeyType={returnKeyType}
            secureTextEntry={secureTextEntry}
            style={[
              styles.input,
              isInvalid && styles.inputInvalid,
              (!multiline || numberOfLines === 1) && styles.singleline,
            ]}
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
  inputContainer: {
    marginVertical: theme.spacing['2'],
  },
  label: {
    marginBottom: theme.spacing['2'],
  },
  labelInvalid: {
    color: theme.colors.secondary,
  },
  inputSection: {
    backgroundColor: theme.colors.backgroundPrimary,
    borderColor: 'gray',
    borderRadius: theme.borderRadius.default,
    borderWidth: theme.borderWidth.default,
    overflow: 'hidden',
  },
  input: {
    ...theme.fontSize.base,
    alignItems: 'center',
    color: theme.colors.textPrimary,
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacing['2'],
    textAlignVertical: 'top',
  },
  singleline: {
    height: theme.spacing['10'],
    paddingHorizontal: theme.spacing['2'],
    paddingVertical: theme.spacing['0'],
    textAlignVertical: 'center',
  },
  inputInvalid: {
    borderColor: theme.colors.secondary,
  },
  icon: {
    alignItems: 'center',
    display: 'flex',
    height: theme.spacing['10'],
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    top: 0,
    width: theme.spacing['10'],
  },
});