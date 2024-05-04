import { Controller, useForm } from 'react-hook-form';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import ContactService from '../services/ContactService';
import theme from '../styles/theme';
import { Button } from './UI';

function ContactForm({ centerId }) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      await ContactService.sendContactMessage({ ...data, centerId });
      reset();
      Alert.alert('Success', 'Your message has been sent successfully!');
    } catch (error) {
      Alert.alert(
        'Error',
        error.message || 'There was an error sending your message.'
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
            required: 'Name is required',
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Name"
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
            required: 'Email is required',
            pattern: {
              value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
              message: 'Invalid email address',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Email"
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
            required: 'Message is required',
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, styles.textArea]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Message"
              multiline
            />
          )}
          name="message"
        />
        {errors.message && (
          <Text style={styles.errorText}>{errors.message.message}</Text>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <Button onPress={handleSubmit(onSubmit)}>Send Message</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    gap: theme.spacing['4'],
    padding: theme.spacing['6'],
  },
  input: {
    borderColor: theme.colors.textPrimary,
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
    color: theme.colors.secondary,
  },
  buttonContainer: {
    alignItems: 'center',
  },
});

export default ContactForm;
