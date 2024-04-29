import { Ionicons } from '@expo/vector-icons';
import React, { forwardRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Colors from '../../styles/colors';

const Input = forwardRef(
  (
    {
      autoFocus = false,
      blurOnSubmit = true,
      isInvalid,
      keyboardType = 'default',
      label,
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
            onChangeText={onChangeText}
            onFocus={onFocus}
            onSubmitEditing={onSubmitEditing}
            placeholder={placeholder}
            ref={ref}
            returnKeyType={returnKeyType}
            secureTextEntry={secureTextEntry}
            style={[styles.input, isInvalid && styles.inputInvalid]}
            value={value}
          />
          {secure && (
            <TouchableOpacity
              onPress={() => setSecureTextEntry((prev) => !prev)}
              style={styles.icon}
            >
              <Ionicons
                color={Colors.text}
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
    marginVertical: 8,
  },
  label: {
    marginBottom: 4,
  },
  labelInvalid: {
    color: Colors.accent,
  },
  inputSection: {
    backgroundColor: Colors.background,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    overflow: 'hidden',
  },
  input: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    paddingHorizontal: 8,
    fontSize: 16,
    color: Colors.text,
  },
  inputInvalid: {
    borderColor: Colors.accent,
  },
  icon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
