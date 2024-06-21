import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import global from '../../styles/global';
import theme from '../../styles/theme';

export default function CustomAlert({
  visible,
  title,
  message,
  confirmText,
  onConfirm,
  cancelText,
  onCancel,
}) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.alertContainer}>
          <Text style={styles.alertTitle}>{title}</Text>
          <Text style={styles.alertMessage}>{message}</Text>
          <View style={styles.buttonContainer}>
            {cancelText && (
              <Pressable
                onPress={onCancel}
                style={({ pressed }) => [
                  styles.button,
                  styles.buttonCancel,
                  pressed && global.pressed,
                ]}
              >
                <Text style={[styles.buttonText, styles.buttonTextCancel]}>
                  {cancelText}
                </Text>
              </Pressable>
            )}
            {confirmText && (
              <Pressable
                onPress={onConfirm}
                style={({ pressed }) => [
                  styles.button,
                  styles.buttonConfirm,
                  pressed && global.pressed,
                ]}
              >
                <Text style={[styles.buttonText, styles.buttonTextConfirm]}>
                  {confirmText}
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
  },
  alertContainer: {
    backgroundColor: theme.colors.backgroundPrimary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[4],
    width: theme.spacing[80],
  },
  alertTitle: {
    ...theme.fontSize.lg,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.heading,
    marginBottom: theme.spacing[2],
  },
  alertMessage: {
    ...theme.fontSize.base,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily.body,
    marginBottom: theme.spacing[4],
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
  button: {
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
  },
  buttonText: {
    ...theme.fontSize.base,
    color: theme.colors.primary,
    fontFamily: theme.fontFamily.body,
  },
  buttonCancel: {
    marginRight: theme.spacing[2],
  },
  buttonTextCancel: {
    color: theme.colors.error,
  },
  buttonConfirm: {
    backgroundColor: theme.colors.primary,
  },
  buttonTextConfirm: {
    color: theme.colors.backgroundPrimary,
  },
});
