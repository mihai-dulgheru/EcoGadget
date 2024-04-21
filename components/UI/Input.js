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
      blurOnSubmit = true,
      isInvalid,
      keyboardType = 'default',
      label,
      onFocus,
      onSubmitEditing,
      onUpdateValue,
      placeholder,
      returnKeyType,
      secure = false,
      value,
    },
    ref
  ) => {
    const [isSecureEntry, setIsSecureEntry] = useState(secure);

    return (
      <View style={styles.inputContainer}>
        <Text style={[styles.label, isInvalid && styles.labelInvalid]}>
          {label}
        </Text>
        <View style={styles.inputSection}>
          <TextInput
            autoCapitalize="none"
            blurOnSubmit={blurOnSubmit}
            keyboardType={keyboardType}
            onChangeText={onUpdateValue}
            onFocus={onFocus}
            onSubmitEditing={onSubmitEditing}
            placeholder={placeholder}
            ref={ref}
            returnKeyType={returnKeyType}
            secureTextEntry={isSecureEntry}
            style={[styles.input, isInvalid && styles.inputInvalid]}
            value={value}
          />
          {secure && (
            <TouchableOpacity
              onPress={() => setIsSecureEntry((prev) => !prev)}
              style={styles.icon}
            >
              <Ionicons
                name={isSecureEntry ? 'eye-off' : 'eye'}
                size={24}
                color={Colors.text}
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
    fontSize: 16,
  },
  inputInvalid: {
    borderColor: Colors.accent,
  },
  icon: {
    padding: 10,
  },
});
