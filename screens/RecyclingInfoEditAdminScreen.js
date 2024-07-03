import { useMutation, useQueryClient } from '@tanstack/react-query';
import Checkbox from 'expo-checkbox';
import { FieldArray, Formik } from 'formik';
import { isEmpty } from 'lodash';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import * as Yup from 'yup';
import { DatePickerField, LocationPicker } from '../components';
import { Debug, ErrorMessage, Field } from '../components/Formik';
import {
  Button,
  CustomAlert,
  ImagePicker,
  LoadingOverlay,
} from '../components/UI';
import {
  DEFAULT_LATITUDE,
  DEFAULT_LONGITUDE,
  RIPPLE_CONFIG,
} from '../constants';
import RecyclingInfoService from '../services/RecyclingInfoService';
import global from '../styles/global';
import theme from '../styles/theme';
import { useAxiosAuth } from '../utils/Axios';

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Titlul este obligatoriu'),
  subtitle: Yup.string().required('Subtitlul este obligatoriu'),
  picture: Yup.string().required('Imaginea este obligatorie'),
  tags: Yup.string().required('Etichetele sunt obligatorii'),
  date: Yup.date().required('Data este obligatorie'),
  location: Yup.object().shape({
    name: Yup.string().required('Locația este obligatorie'),
    longitude: Yup.number().required('Longitudinea este obligatorie'),
    latitude: Yup.number().required('Latitudinea este obligatorie'),
  }),
  sections: Yup.array().of(
    Yup.object().shape({
      type: Yup.string().required('Tipul secțiunii este obligatoriu'),
      // heading: Yup.string().when('type', {
      //   is: 'heading',
      //   then: Yup.string().required('Titlul secțiunii este obligatoriu'),
      // }),
      // content: Yup.string().when('type', {
      //   is: 'content',
      //   then: Yup.string().required('Conținutul secțiunii este obligatoriu'),
      // }),
      // contact: Yup.object().shape({
      //   address: Yup.string().when('type', {
      //     is: 'contact',
      //     then: Yup.string().required('Adresa este obligatorie'),
      //   }),
      //   email: Yup.string().when('type', {
      //     is: 'contact',
      //     then: Yup.string()
      //       .email('Adresa de email nu este validă')
      //       .required('Email-ul este obligatoriu'),
      //   }),
      //   phone: Yup.string().when('type', {
      //     is: 'contact',
      //     then: Yup.string()
      //       .matches(/^[0-9]+$/, 'Telefonul trebuie să conțină doar cifre')
      //       .min(10, 'Telefonul trebuie să aibă cel puțin 10 cifre')
      //       .required('Telefonul este obligatoriu'),
      //   }),
      // }),
    })
  ),
});

// const defaultInfo = {
//   title: '',
//   subtitle: '',
//   picture: '',
//   tags: '',
//   date: new Date(),
//   location: {
//     name: '',
//     longitude: '',
//     latitude: '',
//   },
//   sections: [],
// };
const defaultInfo = {
  title: 'Titlu',
  subtitle: 'Subtitlu',
  picture: '',
  tags: 'tag1, tag2, tag3',
  date: new Date(),
  location: {
    name: 'Locație',
    longitude: DEFAULT_LONGITUDE,
    latitude: DEFAULT_LATITUDE,
  },
  sections: [
    {
      _id: uuidv4(),
      type: 'heading',
      heading: 'Secțiune 1',
    },
    {
      _id: uuidv4(),
      type: 'content',
      content: 'Conținut secțiune 1',
    },
    {
      _id: uuidv4(),
      type: 'contact',
      contact: {
        address: 'Adresa',
        email: 'test@example.com',
        phone: '0123456789',
      },
    },
  ],
};

const sectionTypes = [
  { label: 'Titlu', value: 'heading' },
  { label: 'Text', value: 'content' },
  { label: 'Contact', value: 'contact' },
];

function SectionFields({ type, index, props }) {
  switch (type) {
    case 'heading':
      return (
        <View style={global.spacingSmall}>
          <Field
            formikProps={props}
            name={`sections.${index}.heading`}
            placeholder="Introduceți titlul secțiunii"
          />
          <ErrorMessage name={`sections.${index}.heading`} />
        </View>
      );
    case 'content':
      return (
        <View style={global.spacingSmall}>
          <Field
            formikProps={props}
            multiline
            name={`sections.${index}.content`}
            placeholder="Introduceți conținutul secțiunii"
          />
          <ErrorMessage name={`sections.${index}.content`} />
        </View>
      );
    case 'contact':
      return (
        <View style={global.spacingSmall}>
          <Field
            formikProps={props}
            name={`sections.${index}.contact.address`}
            placeholder="Introduceți adresa"
          />
          <ErrorMessage name={`sections.${index}.contact.address`} />
          <Field
            formikProps={props}
            keyboardType="email-address"
            name={`sections.${index}.contact.email`}
            placeholder="Introduceți email-ul"
          />
          <ErrorMessage name={`sections.${index}.contact.email`} />
          <Field
            formikProps={props}
            keyboardType="phone-pad"
            name={`sections.${index}.contact.phone`}
            placeholder="Introduceți telefonul"
          />
          <ErrorMessage name={`sections.${index}.contact.phone`} />
        </View>
      );
    default:
      return null;
  }
}

export default function RecyclingInfoEditAdminScreen({ navigation, route }) {
  const AxiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertProps, setAlertProps] = useState({});

  const inputRefs = {
    title: useRef(null),
    subtitle: useRef(null),
    tags: useRef(null),
    location: {
      name: useRef(null),
      longitude: useRef(null),
      latitude: useRef(null),
    },
  };

  const initialValues = useMemo(() => {
    if (route.params.info && !isEmpty(route.params.info)) {
      return {
        ...route.params.info,
        date: new Date(route.params.info.date),
        tags: route.params.info.tags?.join(', '),
      };
    }
    return defaultInfo;
  }, [route.params.info]);

  const showAlert = (title, message, confirmText, onConfirm) => {
    setAlertProps({ title, message, confirmText, onConfirm });
    setAlertVisible(true);
  };

  const mutation = useMutation({
    mutationFn: async (values) => {
      const { _id, tags, sections, ...rest } = values;
      const processedTags = tags?.split(',').map((tag) => tag.trim());
      const filteredSections = sections
        .filter((section) => {
          const { type, heading, content, contact } = section;
          if (type === 'heading' && !heading) {
            return false;
          }
          if (type === 'content' && !content) {
            return false;
          }
          if (
            type === 'contact' &&
            (!contact.address || !contact.email || !contact.phone)
          ) {
            return false;
          }
          return true;
        })
        .map((section) => {
          const { _id: _, ...sectionWithoutId } = section;
          return sectionWithoutId;
        });
      const clonedValues = {
        ...rest,
        tags: processedTags,
        sections: filteredSections,
      };
      if (_id) {
        await RecyclingInfoService.updateRecyclingInfo(
          AxiosAuth,
          _id,
          clonedValues
        );
      } else {
        await RecyclingInfoService.addRecyclingInfo(AxiosAuth, clonedValues);
      }
    },
    onSuccess: async () => {
      showAlert(
        'Succes',
        'Informația a fost salvată cu succes',
        'OK',
        async () => {
          setAlertVisible(false);
          navigation.goBack();
          await queryClient.invalidateQueries(['infos']);
        }
      );
    },
    onError: () => {
      showAlert(
        'Eroare',
        'A apărut o eroare la salvarea informației. Vă rugăm să încercați din nou.',
        'OK',
        () => setAlertVisible(false)
      );
    },
  });

  const handleSave = useCallback(
    async (values) => mutation.mutateAsync(values),
    [mutation]
  );

  if (mutation.isPending) {
    return <LoadingOverlay message="Salvare informație..." />;
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
                onImagePicked={(image) => props.setFieldValue('picture', image)}
                initialImage={props.values.picture}
                style={styles.imagePicker}
              />
              <ErrorMessage name="picture" />
            </View>
            <View>
              <Field
                blurOnSubmit={false}
                formikProps={props}
                label="Titlu"
                name="title"
                onSubmitEditing={() => inputRefs.subtitle.current.focus()}
                placeholder="Introduceți titlul informației"
                ref={inputRefs.title}
                returnKeyType="next"
              />
              <ErrorMessage name="title" />
            </View>
            <View>
              <Field
                blurOnSubmit={false}
                formikProps={props}
                label="Subtitlu"
                name="subtitle"
                onSubmitEditing={() => inputRefs.location.name.current.focus()}
                placeholder="Introduceți subtitlul informației"
                ref={inputRefs.subtitle}
                returnKeyType="next"
              />
              <ErrorMessage name="subtitle" />
            </View>
            <View>
              <DatePickerField label="Data" name="date" />
              <ErrorMessage name="date" />
            </View>
            <View>
              <LocationPicker
                blurOnSubmit={false}
                formikProps={props}
                initialAddress={props.values.location.name}
                initialLatitude={props.values.location.latitude}
                initialLongitude={props.values.location.longitude}
                label="Locație"
                name="location"
                onAddressChange={(address) => {
                  props.setFieldValue('location.name', address);
                }}
                onLocationPicked={(lat, lng) => {
                  props.setFieldValue('location.latitude', lat);
                  props.setFieldValue('location.longitude', lng);
                }}
                onSubmitEditing={() => inputRefs.tags.current.focus()}
                placeholder="Introduceți locația"
                ref={inputRefs.location.name}
                returnKeyType="next"
              />
              <ErrorMessage name="location.name" />
            </View>
            <View>
              <Field
                formikProps={props}
                label="Etichete"
                name="tags"
                placeholder="Introduceți etichete separate prin virgulă"
                ref={inputRefs.tags}
              />
              <ErrorMessage name="tags" />
            </View>
            <View style={styles.sectionContainer}>
              <FieldArray name="sections">
                {({ remove, push }) => (
                  <View>
                    {props.values.sections.map((section, index) => (
                      <View key={section._id} style={styles.section}>
                        <View style={styles.rowContainer}>
                          <View style={styles.checkboxContainer}>
                            {sectionTypes.map((option) => (
                              <View
                                key={option.value}
                                style={styles.sectionTypeContainer}
                              >
                                <Checkbox
                                  color={theme.colors.primary}
                                  onValueChange={(newValue) => {
                                    if (newValue) {
                                      props.setFieldValue(
                                        `sections.${index}.type`,
                                        option.value
                                      );
                                    }
                                  }}
                                  style={styles.checkbox}
                                  value={section.type === option.value}
                                />
                                <Pressable
                                  onPress={() =>
                                    props.setFieldValue(
                                      `sections.${index}.type`,
                                      option.value
                                    )
                                  }
                                  style={({ pressed }) => [
                                    styles.pressable,
                                    pressed && global.pressed,
                                  ]}
                                >
                                  <Text style={styles.label}>
                                    {option.label}
                                  </Text>
                                </Pressable>
                              </View>
                            ))}
                          </View>
                          <Pressable
                            android_ripple={{
                              ...RIPPLE_CONFIG,
                              radius: theme.spacing[48],
                            }}
                            onPress={() => remove(index)}
                            style={styles.removeButton}
                          >
                            <Text style={styles.removeButtonLabel}>Șterge</Text>
                          </Pressable>
                        </View>
                        <SectionFields
                          type={section.type}
                          index={index}
                          props={props}
                        />
                      </View>
                    ))}
                    <Pressable
                      onPress={() => push({ _id: uuidv4(), type: 'heading' })}
                      style={({ pressed }) => [
                        styles.button,
                        pressed && global.pressed,
                      ]}
                    >
                      <View>
                        <Text style={styles.buttonText}>Adaugă secțiune</Text>
                      </View>
                    </Pressable>
                  </View>
                )}
              </FieldArray>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Salvează informația" onPress={props.handleSubmit} />
          </View>
          <CustomAlert visible={alertVisible} {...alertProps} />
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
  contentContainer: {
    ...global.spacingMedium,
    padding: theme.spacing[4],
  },
  imagePicker: {
    ...global.spacingMedium,
  },
  button: {
    backgroundColor: theme.colors.backgroundPrimary,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    borderWidth: theme.borderWidth.default,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
    width: '100%',
  },
  buttonText: {
    ...theme.fontSize.base,
    color: theme.colors.primary,
    fontFamily: theme.fontFamily.heading,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: theme.spacing[4],
  },
  sectionContainer: {
    marginVertical: theme.spacing[2],
  },
  section: {
    ...global.spacingMedium,
    marginBottom: theme.spacing[6],
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  removeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing[2],
    padding: theme.spacing[2],
  },
  removeButtonLabel: {
    ...theme.fontSize.base,
    color: theme.colors.error,
    fontFamily: theme.fontFamily.body,
  },
  checkboxContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing[4],
  },
  sectionTypeContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  checkbox: {
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.full,
    borderWidth: theme.borderWidth.default,
  },
  label: {
    ...theme.fontSize.base,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.body,
    marginLeft: theme.spacing[2],
  },
  pressable: {
    opacity: theme.opacity.default,
  },
});
