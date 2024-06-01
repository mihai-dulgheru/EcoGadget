import { Formik } from 'formik';
import { useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import * as Yup from 'yup';
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
    // TODO: Remove default values
    // name: '',
    // address: '',
    // image: '',
    // phone: '',
    // description: '',
    // schedule: {
    //   monday: '',
    //   tuesday: '',
    //   wednesday: '',
    //   thursday: '',
    //   friday: '',
    //   saturday: '',
    //   sunday: '',
    // },
    // company: '',
    // cui: '',
    // regCom: '',
    // latitude: '',
    // longitude: '',
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
      saturday: '10:00 AM - 2:00 PM',
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
      // TODO: Refresh the list of locations
      // navigation.navigate('RecyclingLocationList', {
      //   dataUpdatedAt: Date.now(),
      // });
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
            <ImagePicker
              onImagePicked={(image) => props.setFieldValue('image', image)}
              initialImage={props.values.image}
              style={styles.imagePicker}
            />
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
              <Field
                formikProps={props}
                label="Luni"
                name="schedule.monday"
                onSubmitEditing={() =>
                  inputRefs.schedule.tuesday.current.focus()
                }
                placeholder="Introduceți programul pentru luni"
                ref={inputRefs.schedule.monday}
                returnKeyType="next"
              />
              <ErrorMessage name="schedule.monday" />
            </View>
            <View>
              <Field
                formikProps={props}
                label="Marți"
                name="schedule.tuesday"
                onSubmitEditing={() =>
                  inputRefs.schedule.wednesday.current.focus()
                }
                placeholder="Introduceți programul pentru marți"
                ref={inputRefs.schedule.tuesday}
                returnKeyType="next"
              />
              <ErrorMessage name="schedule.tuesday" />
            </View>
            <View>
              <Field
                formikProps={props}
                label="Miercuri"
                name="schedule.wednesday"
                onSubmitEditing={() =>
                  inputRefs.schedule.thursday.current.focus()
                }
                placeholder="Introduceți programul pentru miercuri"
                ref={inputRefs.schedule.wednesday}
                returnKeyType="next"
              />
              <ErrorMessage name="schedule.wednesday" />
            </View>
            <View>
              <Field
                formikProps={props}
                label="Joi"
                name="schedule.thursday"
                onSubmitEditing={() =>
                  inputRefs.schedule.friday.current.focus()
                }
                placeholder="Introduceți programul pentru joi"
                ref={inputRefs.schedule.thursday}
                returnKeyType="next"
              />
              <ErrorMessage name="schedule.thursday" />
            </View>
            <View>
              <Field
                formikProps={props}
                label="Vineri"
                name="schedule.friday"
                onSubmitEditing={() =>
                  inputRefs.schedule.saturday.current.focus()
                }
                placeholder="Introduceți programul pentru vineri"
                ref={inputRefs.schedule.friday}
                returnKeyType="next"
              />
              <ErrorMessage name="schedule.friday" />
            </View>
            <View>
              <Field
                formikProps={props}
                label="Sâmbătă"
                name="schedule.saturday"
                onSubmitEditing={() =>
                  inputRefs.schedule.sunday.current.focus()
                }
                placeholder="Introduceți programul pentru sâmbătă"
                ref={inputRefs.schedule.saturday}
                returnKeyType="next"
              />
              <ErrorMessage name="schedule.saturday" />
            </View>
            <View>
              <Field
                formikProps={props}
                label="Duminică"
                name="schedule.sunday"
                placeholder="Introduceți programul pentru duminică"
                ref={inputRefs.schedule.sunday}
                returnKeyType="next"
              />
              <ErrorMessage name="schedule.sunday" />
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
            {/* TODO: Add location picker (map view) */}
            <View>
              <Field
                formikProps={props}
                keyboardType="numeric"
                label="Latitudine"
                name="latitude"
                onSubmitEditing={() => inputRefs.longitude.current.focus()}
                placeholder="Introduceți latitudinea locației"
                ref={inputRefs.latitude}
                returnKeyType="next"
              />
              <ErrorMessage name="latitude" />
            </View>
            <View>
              <Field
                formikProps={props}
                keyboardType="numeric"
                label="Longitudine"
                name="longitude"
                placeholder="Introduceți longitudinea locației"
                ref={inputRefs.longitude}
                returnKeyType="done"
              />
              <ErrorMessage name="longitude" />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Salvează locația" onPress={props.handleSubmit} />
          </View>
          {/* TODO: Remove debug component */}
          <Debug debug formikProps={props} />
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
    marginTop: theme.spacing['4'],
  },
});
