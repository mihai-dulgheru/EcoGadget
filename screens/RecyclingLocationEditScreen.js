import { Formik } from 'formik';
import { useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Yup from 'yup';
import { LocationPicker, ScheduleField } from '../components';
import { Debug, ErrorMessage, Field } from '../components/Formik';
import { Button, Error, ImagePicker, Loading } from '../components/UI';
import RecyclingService from '../services/RecyclingService';
import global from '../styles/global';
import theme from '../styles/theme';
import { useAxiosAuth } from '../utils/Axios';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Numele este obligatoriu'),
  address: Yup.string().required('Adresa este obligatorie'),
  image: Yup.string().required('Imaginea este obligatorie'),
  phone: Yup.string().required('Telefonul este obligatoriu'),
  description: Yup.string().required('Descrierea este obligatorie'),
  schedule: Yup.object().shape({
    monday: Yup.string().required('Programul de luni este obligatoriu'),
    tuesday: Yup.string().required('Programul de marți este obligatoriu'),
    wednesday: Yup.string().required('Programul de miercuri este obligatoriu'),
    thursday: Yup.string().required('Programul de joi este obligatoriu'),
    friday: Yup.string().required('Programul de vineri este obligatoriu'),
    saturday: Yup.string().required('Programul de sâmbătă este obligatoriu'),
    sunday: Yup.string().required('Programul de duminică este obligatoriu'),
  }),
  company: Yup.string().required('Compania este obligatorie'),
  cui: Yup.string().required('CUI este obligatoriu'),
  regCom: Yup.string().required('Registrul Comerțului este obligatoriu'),
  latitude: Yup.number()
    .typeError('Latitudinea trebuie să fie un număr')
    .required('Latitudinea este obligatorie'),
  longitude: Yup.number()
    .typeError('Longitudinea trebuie să fie un număr')
    .required('Longitudinea este obligatorie'),
});

export default function RecyclingLocationEditScreen({ navigation, route }) {
  const defaultLocation = {
    name: 'Recycling Center 1',
    address: '123 Main St, YourCity',
    image: '',
    phone: '+1234567890',
    description:
      'This is a state-of-the-art facility that specializes in recycling electronics and hazardous materials.',
    schedule: {
      monday: '9:00 AM - 5:00 PM',
      tuesday: '9:00 AM - 5:00 PM',
      wednesday: '9:00 AM - 5:00 PM',
      thursday: '9:00 AM - 5:00 PM',
      friday: '9:00 AM - 5:00 PM',
      saturday: 'Closed',
      sunday: 'Closed',
    },
    company: 'EcoRecycle Inc.',
    cui: 'RO12345678',
    regCom: 'J12/3456/2009',
    latitude: 44.43301523279083,
    longitude: 26.040600654474453,
  };

  const [status, setStatus] = useState('idle');
  const AxiosAuth = useAxiosAuth();

  const inputRefs = {
    address: useRef(null),
    phone: useRef(null),
    description: useRef(null),
    schedule: {
      monday: useRef(null),
      tuesday: useRef(null),
      wednesday: useRef(null),
      thursday: useRef(null),
      friday: useRef(null),
      saturday: useRef(null),
      sunday: useRef(null),
    },
    company: useRef(null),
    cui: useRef(null),
    regCom: useRef(null),
    latitude: useRef(null),
    longitude: useRef(null),
  };

  const initialValues = route.params?.location || defaultLocation;

  const handleSave = async (values) => {
    try {
      setStatus('loading');
      if (values._id) {
        await RecyclingService.updateRecyclingLocation(
          AxiosAuth,
          values._id,
          values
        );
      } else {
        await RecyclingService.addRecyclingLocation(AxiosAuth, values);
      }
      navigation.navigate('RecyclingLocationList', {
        dataUpdatedAt: Date.now(),
      });
    } catch (error) {
      console.error('Error saving location:', error);
      Alert.alert(
        'Eroare',
        'A apărut o eroare la salvarea locației. Vă rugăm să încercați din nou.',
        [{ text: 'OK' }]
      );
      setStatus('error');
    } finally {
      setStatus('idle');
    }
  };

  if (status === 'loading') {
    return <Loading />;
  }

  if (status === 'error') {
    return <Error message="A apărut o eroare la salvarea locației" />;
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSave}
    >
      {(props) => (
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={global.spacingSmall}>
            <View>
              <ImagePicker
                onImagePicked={(image) => props.setFieldValue('image', image)}
                initialImage={props.values.image}
                style={styles.imagePicker}
              />
              <ErrorMessage name="image" />
            </View>
            <View>
              <Field
                blurOnSubmit={false}
                formikProps={props}
                label="Nume"
                name="name"
                onSubmitEditing={() => inputRefs.address.current.focus()}
                placeholder="Introduceți numele locației"
                ref={inputRefs.name}
                returnKeyType="next"
              />
              <ErrorMessage name="name" />
            </View>
            <View>
              <Field
                blurOnSubmit={false}
                formikProps={props}
                label="Adresa"
                name="address"
                onSubmitEditing={() => inputRefs.phone.current.focus()}
                placeholder="Introduceți adresa locației"
                ref={inputRefs.address}
                returnKeyType="next"
              />
              <ErrorMessage name="address" />
            </View>
            <View>
              <LocationPicker
                initialLatitude={props.values.latitude}
                initialLongitude={props.values.longitude}
                address={props.values.address}
                onLocationPicked={(lat, lng) => {
                  props.setFieldValue('latitude', lat);
                  props.setFieldValue('longitude', lng);
                }}
                style={styles.map}
              />
            </View>
            <View>
              <Field
                blurOnSubmit={false}
                formikProps={props}
                label="Telefon"
                name="phone"
                onSubmitEditing={() => inputRefs.description.current.focus()}
                placeholder="Introduceți numărul de telefon"
                ref={inputRefs.phone}
                returnKeyType="next"
              />
              <ErrorMessage name="phone" />
            </View>
            <View>
              <Field
                blurOnSubmit={false}
                formikProps={props}
                label="Descriere"
                multiline
                name="description"
                numberOfLines={4}
                onSubmitEditing={() =>
                  inputRefs.schedule.monday.current.focus()
                }
                placeholder="Introduceți o descriere"
                ref={inputRefs.description}
                returnKeyType="next"
              />
              <ErrorMessage name="description" />
            </View>
            <View>
              <Text style={styles.scheduleLabel}>Program</Text>
              <View style={styles.scheduleContainer}>
                <View>
                  <ScheduleField
                    formikProps={props}
                    label="Luni"
                    name="schedule.monday"
                  />
                  <ErrorMessage name="schedule.monday" />
                </View>
                <View>
                  <ScheduleField
                    formikProps={props}
                    label="Marți"
                    name="schedule.tuesday"
                  />
                  <ErrorMessage name="schedule.tuesday" />
                </View>
                <View>
                  <ScheduleField
                    formikProps={props}
                    label="Miercuri"
                    name="schedule.wednesday"
                  />
                  <ErrorMessage name="schedule.wednesday" />
                </View>
                <View>
                  <ScheduleField
                    formikProps={props}
                    label="Joi"
                    name="schedule.thursday"
                  />
                  <ErrorMessage name="schedule.thursday" />
                </View>
                <View>
                  <ScheduleField
                    formikProps={props}
                    label="Vineri"
                    name="schedule.friday"
                  />
                  <ErrorMessage name="schedule.friday" />
                </View>
                <View>
                  <ScheduleField
                    formikProps={props}
                    label="Sâmbătă"
                    name="schedule.saturday"
                  />
                  <ErrorMessage name="schedule.saturday" />
                </View>
                <View>
                  <ScheduleField
                    formikProps={props}
                    label="Duminică"
                    name="schedule.sunday"
                  />
                  <ErrorMessage name="schedule.sunday" />
                </View>
              </View>
            </View>
            <View>
              <Field
                formikProps={props}
                label="Companie"
                name="company"
                onSubmitEditing={() => inputRefs.cui.current.focus()}
                placeholder="Introduceți numele companiei"
                ref={inputRefs.company}
                returnKeyType="next"
              />
              <ErrorMessage name="company" />
            </View>
            <View>
              <Field
                formikProps={props}
                label="CUI"
                name="cui"
                onSubmitEditing={() => inputRefs.regCom.current.focus()}
                placeholder="Introduceți CUI-ul companiei"
                ref={inputRefs.cui}
                returnKeyType="next"
              />
              <ErrorMessage name="cui" />
            </View>
            <View>
              <Field
                formikProps={props}
                label="Registrul Comerțului"
                name="regCom"
                onSubmitEditing={() => inputRefs.latitude.current.focus()}
                placeholder="Introduceți Registrul Comerțului"
                ref={inputRefs.regCom}
                returnKeyType="next"
              />
              <ErrorMessage name="regCom" />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Salvează locația" onPress={props.handleSubmit} />
          </View>
          <Debug debug={false} formikProps={props} />
        </ScrollView>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.backgroundPrimary,
    flex: 1,
  },
  imagePicker: {
    gap: theme.spacing['4'],
  },
  contentContainer: {
    gap: theme.spacing['4'],
    padding: theme.spacing['4'],
  },
  buttonContainer: {
    marginVertical: theme.spacing['4'],
  },
  map: {
    width: '100%',
    height: 300,
  },
  scheduleContainer: {
    gap: theme.spacing['2'],
  },
  scheduleLabel: {
    ...theme.fontSize.lg,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
});
