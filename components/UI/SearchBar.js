import { Ionicons } from '@expo/vector-icons';
import { debounce } from 'lodash';
import { useCallback, useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import global from '../../styles/global';
import theme from '../../styles/theme';

export default function SearchBar({
  onBack,
  onChangeText,
  onClear,
  onFocus,
  placeholder = 'Caută...',
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [text, setText] = useState('');
  const textInputRef = useRef(null);

  const debouncedOnChangeText = useCallback(debounce(onChangeText, 300), []);

  const handleBack = () => {
    setIsFocused(false);
    setText('');
    textInputRef.current.blur();
    if (typeof onBack === 'function') {
      onBack();
    }
  };

  const handleTextChange = (inputText) => {
    setText(inputText);
    debouncedOnChangeText(inputText);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (typeof onFocus === 'function') {
      onFocus();
    }
  };

  const handleClear = () => {
    setText('');
    if (typeof onClear === 'function') {
      onClear();
    }
  };

  return (
    <View style={styles.container}>
      {!isFocused && (
        <Ionicons name="search" size={24} color="gray" style={styles.icon} />
      )}
      {isFocused && (
        <Pressable onPress={handleBack}>
          <Ionicons
            name="arrow-back"
            size={24}
            color="gray"
            style={styles.icon}
          />
        </Pressable>
      )}
      <TextInput
        onChangeText={handleTextChange}
        onFocus={handleFocus}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        ref={textInputRef}
        style={styles.input}
        value={text}
      />
      {text.length > 0 && (
        <Pressable
          onPress={handleClear}
          style={({ pressed }) => [
            styles.clearButton,
            pressed && global.pressed,
          ]}
        >
          <Ionicons name="close-circle" size={24} color="gray" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...theme.shadow.md,
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundPrimary,
    borderRadius: theme.borderRadius.full,
    flexDirection: 'row',
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
  },
  icon: {
    paddingRight: theme.spacing[2],
    paddingVertical: theme.spacing[1],
  },
  input: {
    ...theme.fontSize.base,
    flex: 1,
    fontFamily: theme.fontFamily.body,
    height: theme.spacing[10],
  },
  clearButton: {
    marginLeft: theme.spacing[2],
  },
});
