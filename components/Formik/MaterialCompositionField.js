import { StyleSheet, Text, View } from 'react-native';
import global from '../../styles/global';
import theme from '../../styles/theme';
import ErrorMessage from './ErrorMessage';
import Field from './Field';

export default function MaterialCompositionField({ formikProps, inputRefs }) {
  const handleBlur = (field) => {
    const { setFieldTouched, setFieldValue, values } = formikProps;
    const metal = parseFloat(values.materialComposition.metal || 0);
    const plastic = parseFloat(values.materialComposition.plastic || 0);
    const other = parseFloat(values.materialComposition.other || 0);

    // Mark the field as touched
    setFieldTouched(`materialComposition.${field}`);

    if (metal + plastic + other === 100) {
      // Everything is complete, no need to update
      return;
    }

    if (field === 'metal' && metal && plastic) {
      setFieldValue(
        'materialComposition.other',
        (100 - metal - plastic).toString()
      );
    } else if (field === 'plastic' && plastic && metal) {
      setFieldValue(
        'materialComposition.other',
        (100 - plastic - metal).toString()
      );
    } else if (field === 'other' && other && metal) {
      setFieldValue(
        'materialComposition.plastic',
        (100 - other - metal).toString()
      );
    } else if (field === 'other' && other && plastic) {
      setFieldValue(
        'materialComposition.metal',
        (100 - other - plastic).toString()
      );
    }
  };

  return (
    <View style={global.spacingSmall}>
      <Text style={styles.heading}>Compoziția materialului (%)</Text>
      <View>
        <Field
          blurOnSubmit={false}
          formikProps={formikProps}
          keyboardType="numeric"
          label="Metal"
          name="materialComposition.metal"
          onBlur={() => handleBlur('metal')}
          onSubmitEditing={() => inputRefs.plastic.current.focus()}
          placeholder="Introduceți procentul de metal"
          ref={inputRefs.metal}
          returnKeyType="next"
        />
        <ErrorMessage name="materialComposition.metal" />
      </View>
      <View>
        <Field
          blurOnSubmit={false}
          formikProps={formikProps}
          keyboardType="numeric"
          label="Plastic"
          name="materialComposition.plastic"
          onBlur={() => handleBlur('plastic')}
          onSubmitEditing={() => inputRefs.other.current.focus()}
          placeholder="Introduceți procentul de plastic"
          ref={inputRefs.plastic}
          returnKeyType="next"
        />
        <ErrorMessage name="materialComposition.plastic" />
      </View>
      <View>
        <Field
          formikProps={formikProps}
          keyboardType="numeric"
          label="Altele"
          name="materialComposition.other"
          onBlur={() => handleBlur('other')}
          placeholder="Introduceți procentul altor materiale"
          ref={inputRefs.other}
          returnKeyType="done"
        />
        <ErrorMessage name="materialComposition.other" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    ...theme.fontSize.lg,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.heading,
  },
});
