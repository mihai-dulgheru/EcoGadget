import { Controller, useForm } from 'react-hook-form';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import ContactService from '../../services/ContactService';
import theme from '../../styles/theme';
import { Button } from '../UI';

function ContactForm({ centerId }) {
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      email: '',
      message: '',
      name: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      await ContactService.sendContactMessage({ ...data, centerId });
      reset();
      Alert.alert('Succes', 'Mesajul a fost trimis cu succes!');
    } catch (error) {
      Alert.alert(
        'Eroare',
        error.message || 'A apărut o eroare la trimiterea mesajului'
      );
      console.error('Submission error', error);
    }
  };

  return (
    <View style={styles.formContainer}>
      <View>
        <Controller
          control={control}
          rules={{
            required: 'Numele este obligatoriu',
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Nume"
            />
          )}
          name="name"
        />
        {errors.name && (
          <Text style={styles.errorText}>{errors.name.message}</Text>
        )}
      </View>
      <View>
        <Controller
          control={control}
          rules={{
            required: 'Adresa de email este obligatorie',
            pattern: {
              value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
              message: 'Adresa de email nu este validă',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Adresa de email"
              keyboardType="email-address"
            />
          )}
          name="email"
        />
        {errors.email && (
          <Text style={styles.errorText}>{errors.email.message}</Text>
        )}
      </View>
      <View>
        <Controller
          control={control}
          rules={{
            required: 'Mesajul este obligatoriu',
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, styles.textArea]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Mesaj"
              multiline
            />
          )}
          name="message"
        />
        {errors.message && (
          <Text style={styles.errorText}>{errors.message.message}</Text>
        )}
      </View>
      <Button onPress={handleSubmit(onSubmit)}>Trimite</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    gap: theme.spacing['4'],
  },
  input: {
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    borderWidth: theme.borderWidth.default,
    padding: theme.spacing['4'],
  },
  textArea: {
    height: theme.spacing['24'],
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
  },
  errorText: {
    color: theme.colors.error,
  },
});

export default ContactForm;
