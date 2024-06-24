import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Formik } from 'formik';
import { isEmpty } from 'lodash';
import { useCallback, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Yup from 'yup';
import { LocationPicker, ScheduleField } from '../components';
import { Debug, ErrorMessage, Field } from '../components/Formik';
import {
  Button,
  CustomAlert,
  ImagePicker,
  LoadingOverlay,
} from '../components/UI';
import { WEEKDAY_TRANSLATIONS } from '../constants';
import RecyclingService from '../services/RecyclingService';
import global from '../styles/global';
import theme from '../styles/theme';
import { useAxiosAuth } from '../utils/Axios';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Numele este obligatoriu'),
  address: Yup.string().required('Adresa este obligatorie'),
  image: Yup.string().required('Imaginea este obligatorie'),
  phone: Yup.string()
    .matches(/^[0-9]+$/, 'Telefonul trebuie să conțină doar cifre')
    .min(10, 'Telefonul trebuie să aibă cel puțin 10 cifre')
    .required('Telefonul este obligatoriu'),
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

const defaultLocation = {
  name: 'Milatex Trade',
  address: 'Bulevardul Iuliu Maniu 7b, București 061072, Romania',
  image: '',
  phone: '0213191632',
  description: 'Deseuri electrice, electronice si electrocasnice mici',
  schedule: {
    monday: '8:00 AM - 4:00 PM',
    tuesday: '8:00 AM - 4:00 PM',
    wednesday: '8:00 AM - 4:00 PM',
    thursday: '8:00 AM - 4:00 PM',
    friday: '8:00 AM - 4:00 PM',
    saturday: 'Closed',
    sunday: 'Closed',
  },
  company: 'MILATEX TRADE S.R.L.',
  cui: '18537237',
  regCom: 'J40/5321/2006',
  latitude: 44.4335339,
  longitude: 26.0512812,
};

export default function RecyclingLocationEditScreen({ navigation, route }) {
  const AxiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertProps, setAlertProps] = useState({});

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

  const initialValues = useMemo(() => {
    if (route.params.location && !isEmpty(route.params.location)) {
      return route.params.location;
    }
    return defaultLocation;
  }, [route.params.location]);

  const showAlert = (title, message, confirmText, onConfirm) => {
    setAlertProps({
      title,
      message,
      confirmText,
      onConfirm,
    });
    setAlertVisible(true);
  };

  const mutation = useMutation({
    mutationFn: async (values) => {
      if (values._id) {
        await RecyclingService.updateRecyclingLocation(
          AxiosAuth,
          values._id,
          values
        );
      } else {
        await RecyclingService.addRecyclingLocation(AxiosAuth, values);
      }
    },
    onSuccess: () => {
      showAlert(
        'Succes',
        'Locația a fost salvată cu succes',
        'OK',
        async () => {
          setAlertVisible(false);
          await queryClient.invalidateQueries(['locations']);
          navigation.goBack();
        }
      );
    },
    onError: () => {
      showAlert(
        'Eroare',
        'A apărut o eroare la salvarea locației. Vă rugăm să încercați din nou.',
        'OK',
        () => setAlertVisible(false)
      );
    },
  });

  const handleSave = useCallback(
    async (values) => {
      await mutation.mutateAsync(values);
    },
    [mutation]
  );

  if (mutation.isPending) {
    return <LoadingOverlay message="Salvare locație..." />;
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
          <View style={global.spacingMedium}>
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
                label="Adresă"
                name="address"
                onSubmitEditing={() => inputRefs.phone.current.focus()}
                placeholder="Introduceți adresa locației"
                ref={inputRefs.address}
                returnKeyType="next"
              />
              <ErrorMessage name="address" />
            </View>
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
            <View>
              <Field
                blurOnSubmit={false}
                formikProps={props}
                keyboardType="phone-pad"
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
            <Text style={styles.scheduleLabel}>Program</Text>
            <View style={styles.scheduleContainer}>
              {Object.keys(props.values.schedule).map((day) => (
                <View key={day}>
                  <ScheduleField
                    label={WEEKDAY_TRANSLATIONS[day]}
                    name={`schedule.${day}`}
                  />
                  <ErrorMessage name={`schedule.${day}`} />
                </View>
              ))}
            </View>
            <View>
              <Field
                blurOnSubmit={false}
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
                blurOnSubmit={false}
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
                placeholder="Introduceți Registrul Comerțului"
                ref={inputRefs.regCom}
                returnKeyType="done"
              />
              <ErrorMessage name="regCom" />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Salvează locația" onPress={props.handleSubmit} />
          </View>
          <CustomAlert visible={alertVisible} {...alertProps} />
          <Debug formikProps={props} />
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
  contentContainer: {
    ...global.spacingMedium,
    padding: theme.spacing[4],
  },
  imagePicker: {
    ...global.spacingMedium,
  },
  buttonContainer: {
    marginTop: theme.spacing[4],
  },
  map: {
    height: theme.spacing[80],
    width: '100%',
  },
  scheduleContainer: {
    ...global.spacingMedium,
  },
  scheduleLabel: {
    ...theme.fontSize.lg,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.heading,
  },
});
