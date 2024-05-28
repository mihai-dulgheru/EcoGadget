import { Formik } from 'formik';
import { isEmpty } from 'lodash';
import { useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import * as Yup from 'yup';
import {
  ErrorMessage,
  Field,
  MaterialCompositionField,
} from '../components/Formik';
import { Button, Error, Loading, Select } from '../components/UI';
import ApplianceService from '../services/ApplianceService';
import global from '../styles/global';
import theme from '../styles/theme';
import { useAxiosAuth } from '../utils/Axios';
import { DisposalOptions, EfficiencyRatings } from '../utils/Enums';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Numele este obligatoriu'),
  description: Yup.string().required('Descrierea este obligatorie'),
  productionYear: Yup.number()
    .typeError('Anul producției trebuie să fie un număr')
    .required('Anul producției este obligatoriu'),
  energyUsage: Yup.number()
    .typeError('Consum de energie trebuie să fie un număr')
    .required('Consum de energie este obligatoriu'),
  CO2Emissions: Yup.number()
    .typeError('Emisii de CO2 trebuie să fie un număr')
    .required('Emisiile de CO2 sunt obligatorii'),
  expectedLifespan: Yup.number()
    .typeError('Durata de viață trebuie să fie un număr')
    .required('Durata de viață este obligatorie'),
  disposalOptions: Yup.string().required(
    'Opțiunile de eliminare sunt obligatorii'
  ),
  efficiencyRating: Yup.string().required(
    'Ratingul de eficiență este obligatoriu'
  ),
  materialComposition: Yup.object().shape({
    metal: Yup.number()
      .typeError('Procentul de metal trebuie să fie un număr')
      .required('Procentul de metal este obligatoriu')
      .min(0, 'Procentul de metal trebuie să fie între 0 și 100')
      .max(100, 'Procentul de metal trebuie să fie între 0 și 100'),
    plastic: Yup.number()
      .typeError('Procentul de plastic trebuie să fie un număr')
      .required('Procentul de plastic este obligatoriu')
      .min(0, 'Procentul de plastic trebuie să fie între 0 și 100')
      .max(100, 'Procentul de plastic trebuie să fie între 0 și 100'),
    other: Yup.number()
      .typeError('Procentul altor materiale trebuie să fie un număr')
      .required('Procentul altor materiale este obligatoriu')
      .min(0, 'Procentul altor materiale trebuie să fie între 0 și 100')
      .max(100, 'Procentul altor materiale trebuie să fie între 0 și 100'),
  }),
});

export default function ApplianceEditScreen({ navigation, route }) {
  const defaultAppliance = {
    name: '',
    description: '',
    productionYear: '',
    energyUsage: '',
    CO2Emissions: '',
    expectedLifespan: '',
    disposalOptions: DisposalOptions.RECYCLABLE,
    efficiencyRating: EfficiencyRatings.A_PLUS_PLUS_PLUS,
    materialComposition: {
      metal: '',
      plastic: '',
      other: '',
    },
  };

  const [status, setStatus] = useState('idle');
  const AxiosAuth = useAxiosAuth();

  const inputRefs = {
    description: useRef(null),
    productionYear: useRef(null),
    energyUsage: useRef(null),
    CO2Emissions: useRef(null),
    expectedLifespan: useRef(null),
    materialComposition: {
      metal: useRef(null),
      plastic: useRef(null),
      other: useRef(null),
    },
  };

  const initialValues = !isEmpty(route.params.appliance)
    ? route.params.appliance
    : defaultAppliance;

  const handleSave = async (values) => {
    try {
      setStatus('loading');
      if (values._id) {
        await ApplianceService.updateAppliance(AxiosAuth, values._id, values);
      } else {
        await ApplianceService.addAppliance(AxiosAuth, values);
      }
      navigation.navigate('ApplianceManagement', { dataUpdatedAt: Date.now() });
    } catch (error) {
      console.error('Error saving appliance:', error);
      Alert.alert(
        'Eroare',
        'A apărut o eroare la salvarea electrocasnicului. Vă rugăm să încercați din nou.',
        [{ text: 'OK' }]
      );
      setStatus('error');
    }
  };

  if (status === 'loading') {
    return <Loading />;
  }

  if (status === 'error') {
    return <Error message="A apărut o eroare la salvarea electrocasnicului" />;
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
              <Field
                blurOnSubmit={false}
                formikProps={props}
                label="Nume"
                name="name"
                onSubmitEditing={() => inputRefs.description.current.focus()}
                placeholder="Introduceți numele electrocasnicului"
                ref={inputRefs.name}
                returnKeyType="next"
              />
              <ErrorMessage name="name" />
            </View>
            <View>
              <Field
                blurOnSubmit={false}
                formikProps={props}
                label="Descriere"
                multiline
                name="description"
                numberOfLines={4}
                onSubmitEditing={() => inputRefs.productionYear.current.focus()}
                placeholder="Introduceți o descriere"
                ref={inputRefs.description}
                returnKeyType="next"
              />
              <ErrorMessage name="description" />
            </View>
            <View>
              <Field
                blurOnSubmit={false}
                formikProps={props}
                keyboardType="numeric"
                label="Anul producției"
                name="productionYear"
                onSubmitEditing={() => inputRefs.energyUsage.current.focus()}
                placeholder="Introduceți anul producției"
                ref={inputRefs.productionYear}
                returnKeyType="next"
              />
              <ErrorMessage name="productionYear" />
            </View>
            <View>
              <Field
                blurOnSubmit={false}
                formikProps={props}
                keyboardType="numeric"
                label="Consum de energie (kWh/an)"
                name="energyUsage"
                onSubmitEditing={() => inputRefs.CO2Emissions.current.focus()}
                placeholder="Introduceți consumul de energie"
                ref={inputRefs.energyUsage}
                returnKeyType="next"
              />
              <ErrorMessage name="energyUsage" />
            </View>
            <View>
              <Field
                blurOnSubmit={false}
                formikProps={props}
                keyboardType="numeric"
                label="Emisii de CO2 (kg/an)"
                name="CO2Emissions"
                onSubmitEditing={() =>
                  inputRefs.expectedLifespan.current.focus()
                }
                placeholder="Introduceți emisiile de CO2"
                ref={inputRefs.CO2Emissions}
                returnKeyType="next"
              />
              <ErrorMessage name="CO2Emissions" />
            </View>
            <View>
              <Field
                formikProps={props}
                keyboardType="numeric"
                label="Durata de viață estimată (ani)"
                name="expectedLifespan"
                placeholder="Introduceți durata de viață estimată"
                ref={inputRefs.expectedLifespan}
                returnKeyType="next"
              />
              <ErrorMessage name="expectedLifespan" />
            </View>
            <View>
              <Select
                label="Opțiuni de eliminare"
                selectedValue={props.values.disposalOptions}
                onValueChange={props.handleChange('disposalOptions')}
                items={Object.keys(DisposalOptions).map((key) => ({
                  label: DisposalOptions[key],
                  value: DisposalOptions[key],
                }))}
                errorText={
                  props.touched.disposalOptions && props.errors.disposalOptions
                }
                isInvalid={
                  props.touched.disposalOptions &&
                  !!props.errors.disposalOptions
                }
              />
            </View>
            <View>
              <Select
                label="Rating de eficiență"
                selectedValue={props.values.efficiencyRating}
                onValueChange={props.handleChange('efficiencyRating')}
                items={Object.values(EfficiencyRatings).map((rating) => ({
                  label: rating,
                  value: rating,
                }))}
                errorText={
                  props.touched.efficiencyRating &&
                  props.errors.efficiencyRating
                }
                isInvalid={
                  props.touched.efficiencyRating &&
                  !!props.errors.efficiencyRating
                }
              />
              <ErrorMessage name="efficiencyRating" />
            </View>
          </View>
          <MaterialCompositionField
            formikProps={props}
            inputRefs={inputRefs.materialComposition}
            styles={styles}
          />
          <View style={styles.buttonContainer}>
            <Button onPress={props.handleSubmit}>Salvează electrocasnic</Button>
          </View>
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
    gap: theme.spacing['4'],
    padding: theme.spacing['4'],
  },
  header: {
    ...theme.fontSize.base,
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: theme.spacing['4'],
  },
});
