import { Ionicons } from '@expo/vector-icons';
import { debounce } from 'lodash';
import { useCallback, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import theme from '../../styles/theme';

export default function SearchBar({
  onChangeText,
  onClear,
  placeholder = 'Caută...',
}) {
  const [text, setText] = useState('');

  const handleTextChange = (inputText) => {
    setText(inputText);
    debouncedOnChangeText(inputText);
  };

  const debouncedOnChangeText = useCallback(debounce(onChangeText, 300), []);

  const handleClear = () => {
    setText('');
    onClear();
  };

  return (
    <View style={styles.container}>
      <Ionicons name="search" size={24} color="gray" style={styles.icon} />
      <TextInput
        onChangeText={handleTextChange}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        style={styles.input}
        value={text}
      />
      {text.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <Ionicons name="close-circle" size={24} color="gray" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundPrimary,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  icon: {
    marginRight: theme.spacing[2],
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
