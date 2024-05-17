import { isEmpty } from 'lodash';
import { useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Error, Input, Loading, Select } from '../components/UI';
import ApplianceService from '../services/ApplianceService';
import theme from '../styles/theme';
import { useAxiosAuth } from '../utils/Axios';
import {
  DisposalOptions,
  DisposalOptionsTranslations,
  EfficiencyRatings,
} from '../utils/Enums';

export default function ApplianceEditScreen({ navigation, route }) {
  const defaultAppliance = {
    name: 'Congelator',
    description: 'Congelator cu 3 sertare',
    productionYear: 2018,
    energyUsage: 300,
    CO2Emissions: 150,
    expectedLifespan: 10,
    disposalOptions: DisposalOptions.RECYCLABLE,
    efficiencyRating: EfficiencyRatings.A_PLUS_PLUS,
    materialComposition: {
      metal: 60,
      plastic: 30,
      other: 10,
    },
  };
  const [appliance, setAppliance] = useState(
    !isEmpty(route.params.appliance) ? route.params.appliance : defaultAppliance
  );
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const inputRefs = {
    name: useRef(null),
    description: useRef(null),
    productionYear: useRef(null),
    energyUsage: useRef(null),
    CO2Emissions: useRef(null),
    expectedLifespan: useRef(null),
    metal: useRef(null),
    plastic: useRef(null),
    other: useRef(null),
  };
  const AxiosAuth = useAxiosAuth();

  const validateInputs = () => {
    const newErrors = {};
    if (!appliance.name) {
      newErrors.name = 'Numele este obligatoriu.';
    }
    if (!appliance.description) {
      newErrors.description = 'Descrierea este obligatorie.';
    }
    if (!appliance.productionYear) {
      newErrors.productionYear = 'Anul producției este obligatoriu.';
    }
    if (!appliance.energyUsage) {
      newErrors.energyUsage = 'Consum de energie este obligatoriu.';
    }
    if (!appliance.CO2Emissions) {
      newErrors.CO2Emissions = 'Emisiile de CO2 sunt obligatorii.';
    }
    if (!appliance.expectedLifespan) {
      newErrors.expectedLifespan = 'Durata de viață este obligatorie.';
    }
    if (!appliance.disposalOptions) {
      newErrors.disposalOptions = 'Opțiunile de eliminare sunt obligatorii.';
    }
    if (!appliance.efficiencyRating) {
      newErrors.efficiencyRating = 'Ratingul de eficiență este obligatoriu.';
    }
    if (!appliance.materialComposition?.metal) {
      newErrors.metal = 'Procentul de metal este obligatoriu.';
    }
    if (!appliance.materialComposition?.plastic) {
      newErrors.plastic = 'Procentul de plastic este obligatoriu.';
    }
    if (!appliance.materialComposition?.other) {
      newErrors.other = 'Procentul altor materiale este obligatoriu.';
    }
    setErrors(newErrors);
    return isEmpty(newErrors);
  };

  const handleSave = async () => {
    if (!validateInputs()) {
      Alert.alert(
        'Eroare',
        'Vă rugăm să completați toate câmpurile obligatorii.'
      );
      return;
    }

    try {
      setStatus('loading');
      if (appliance._id) {
        await ApplianceService.updateAppliance(
          AxiosAuth,
          appliance._id,
          appliance
        );
      } else {
        await ApplianceService.addAppliance(AxiosAuth, appliance);
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.spacingSmall}>
        <Input
          blurOnSubmit={false}
          errorText={errors.name}
          isInvalid={!!errors.name}
          label="Nume"
          onChangeText={(text) => setAppliance({ ...appliance, name: text })}
          onSubmitEditing={() => inputRefs.description.current.focus()}
          placeholder="Introduceți numele electrocasnicului"
          ref={inputRefs.name}
          returnKeyType="next"
          value={appliance.name}
        />
        <Input
          blurOnSubmit={false}
          errorText={errors.description}
          isInvalid={!!errors.description}
          label="Descriere"
          multiline
          numberOfLines={4}
          onChangeText={(text) =>
            setAppliance({ ...appliance, description: text })
          }
          onSubmitEditing={() => inputRefs.productionYear.current.focus()}
          placeholder="Introduceți o descriere"
          ref={inputRefs.description}
          returnKeyType="next"
          value={appliance.description}
        />
        <Input
          blurOnSubmit={false}
          errorText={errors.productionYear}
          isInvalid={!!errors.productionYear}
          keyboardType="numeric"
          label="Anul producției"
          onChangeText={(text) =>
            setAppliance({ ...appliance, productionYear: text })
          }
          onSubmitEditing={() => inputRefs.energyUsage.current.focus()}
          placeholder="Introduceți anul producției"
          ref={inputRefs.productionYear}
          returnKeyType="next"
          value={appliance.productionYear?.toString()}
        />
        <Input
          blurOnSubmit={false}
          errorText={errors.energyUsage}
          isInvalid={!!errors.energyUsage}
          keyboardType="numeric"
          label="Consum de energie (kWh/an)"
          onChangeText={(text) =>
            setAppliance({ ...appliance, energyUsage: text })
          }
          onSubmitEditing={() => inputRefs.CO2Emissions.current.focus()}
          placeholder="Introduceți consumul de energie"
          ref={inputRefs.energyUsage}
          returnKeyType="next"
          value={appliance.energyUsage?.toString()}
        />
        <Input
          blurOnSubmit={false}
          errorText={errors.CO2Emissions}
          isInvalid={!!errors.CO2Emissions}
          keyboardType="numeric"
          label="Emisii de CO2 (kg/an)"
          onChangeText={(text) =>
            setAppliance({ ...appliance, CO2Emissions: text })
          }
          onSubmitEditing={() => inputRefs.expectedLifespan.current.focus()}
          placeholder="Introduceți emisiile de CO2"
          ref={inputRefs.CO2Emissions}
          returnKeyType="next"
          value={appliance.CO2Emissions?.toString()}
        />
        <Input
          errorText={errors.expectedLifespan}
          isInvalid={!!errors.expectedLifespan}
          keyboardType="numeric"
          label="Durata de viață estimată (ani)"
          onChangeText={(text) =>
            setAppliance({ ...appliance, expectedLifespan: text })
          }
          placeholder="Introduceți durata de viață estimată"
          ref={inputRefs.expectedLifespan}
          value={appliance.expectedLifespan?.toString()}
        />
        <Select
          label="Opțiuni de eliminare"
          selectedValue={appliance.disposalOptions}
          onValueChange={(value) =>
            setAppliance({ ...appliance, disposalOptions: value })
          }
          items={Object.keys(DisposalOptions).map((key) => ({
            label: DisposalOptionsTranslations[key],
            value: DisposalOptions[key],
          }))}
          errorText={errors.disposalOptions}
          isInvalid={!!errors.disposalOptions}
        />
        <Select
          label="Rating de eficiență"
          selectedValue={appliance.efficiencyRating}
          onValueChange={(value) =>
            setAppliance({ ...appliance, efficiencyRating: value })
          }
          items={Object.values(EfficiencyRatings).map((rating) => ({
            label: rating,
            value: rating,
          }))}
          errorText={errors.efficiencyRating}
          isInvalid={!!errors.efficiencyRating}
        />
      </View>
      <View style={styles.spacingSmall}>
        <Text style={styles.header}>Compoziția materialului (%)</Text>
        <Input
          blurOnSubmit={false}
          errorText={errors.metal}
          isInvalid={!!errors.metal}
          keyboardType="numeric"
          label="Metal"
          onChangeText={(text) =>
            setAppliance({
              ...appliance,
              materialComposition: {
                ...appliance.materialComposition,
                metal: text,
              },
            })
          }
          onSubmitEditing={() => inputRefs.plastic.current.focus()}
          placeholder="Introduceți procentul de metal"
          ref={inputRefs.metal}
          returnKeyType="next"
          value={appliance.materialComposition?.metal?.toString()}
        />
        <Input
          blurOnSubmit={false}
          errorText={errors.plastic}
          isInvalid={!!errors.plastic}
          keyboardType="numeric"
          label="Plastic"
          onChangeText={(text) =>
            setAppliance({
              ...appliance,
              materialComposition: {
                ...appliance.materialComposition,
                plastic: text,
              },
            })
          }
          onSubmitEditing={() => inputRefs.other.current.focus()}
          placeholder="Introduceți procentul de plastic"
          ref={inputRefs.plastic}
          returnKeyType="next"
          value={appliance.materialComposition?.plastic?.toString()}
        />
        <Input
          blurOnSubmit={false}
          errorText={errors.other}
          isInvalid={!!errors.other}
          keyboardType="numeric"
          label="Altele"
          onChangeText={(text) =>
            setAppliance({
              ...appliance,
              materialComposition: {
                ...appliance.materialComposition,
                other: text,
              },
            })
          }
          onSubmitEditing={handleSave}
          placeholder="Introduceți procentul altor materiale"
          ref={inputRefs.other}
          returnKeyType="done"
          value={appliance.materialComposition?.other?.toString()}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button onPress={handleSave}>Salvează electrocasnic</Button>
      </View>
    </ScrollView>
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
  spacingSmall: {
    gap: theme.spacing['2'],
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
