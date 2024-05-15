import { useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Input } from '../components/UI';
import ApplianceService from '../services/ApplianceService';
import theme from '../styles/theme';

export default function ApplianceEditScreen({ navigation, route }) {
  const [appliance, setAppliance] = useState(
    route.params.appliance || {
      name: '',
      description: '',
      productionYear: '',
      energyUsage: '',
      CO2Emissions: '',
      expectedLifespan: '',
      disposalOptions: '',
      efficiencyRating: '',
      materialComposition: {
        metal: '',
        plastic: '',
        other: '',
      },
    }
  );

  const [errors, setErrors] = useState({});

  const inputRefs = {
    name: useRef(null),
    description: useRef(null),
    productionYear: useRef(null),
    energyUsage: useRef(null),
    CO2Emissions: useRef(null),
    expectedLifespan: useRef(null),
    disposalOptions: useRef(null),
    efficiencyRating: useRef(null),
    metal: useRef(null),
    plastic: useRef(null),
    other: useRef(null),
  };

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

    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateInputs()) {
      Alert.alert(
        'Eroare',
        'Vă rugăm să completați toate câmpurile obligatorii.'
      );
      return;
    }

    if (appliance._id) {
      await ApplianceService.updateAppliance(appliance._id, appliance);
    } else {
      await ApplianceService.addAppliance(appliance);
    }
    navigation.goBack();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View>
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
          blurOnSubmit={false}
          errorText={errors.expectedLifespan}
          isInvalid={!!errors.expectedLifespan}
          keyboardType="numeric"
          label="Durata de viață estimată (ani)"
          onChangeText={(text) =>
            setAppliance({ ...appliance, expectedLifespan: text })
          }
          onSubmitEditing={() => inputRefs.disposalOptions.current.focus()}
          placeholder="Introduceți durata de viață estimată"
          ref={inputRefs.expectedLifespan}
          returnKeyType="next"
          value={appliance.expectedLifespan?.toString()}
        />
        <Input
          blurOnSubmit={false}
          errorText={errors.disposalOptions}
          isInvalid={!!errors.disposalOptions}
          label="Opțiuni de eliminare"
          onChangeText={(text) =>
            setAppliance({ ...appliance, disposalOptions: text })
          }
          onSubmitEditing={() => inputRefs.efficiencyRating.current.focus()}
          placeholder="Introduceți opțiunile de eliminare"
          ref={inputRefs.disposalOptions}
          returnKeyType="next"
          value={appliance.disposalOptions}
        />
        <Input
          blurOnSubmit={false}
          errorText={errors.efficiencyRating}
          isInvalid={!!errors.efficiencyRating}
          label="Rating de eficiență"
          onChangeText={(text) =>
            setAppliance({ ...appliance, efficiencyRating: text })
          }
          onSubmitEditing={() => inputRefs.metal.current.focus()}
          placeholder="Introduceți ratingul de eficiență"
          ref={inputRefs.efficiencyRating}
          returnKeyType="next"
          value={appliance.efficiencyRating}
        />
      </View>
      <View>
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
      <Button onPress={handleSave}>Salvează electrocasnic</Button>
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
  header: {
    ...theme.fontSize.base,
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
  },
});
