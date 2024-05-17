import { Input } from '../UI';

export default function Field({ formikProps, name, ...props }) {
  return (
    <Input
      isInvalid={formikProps?.errors?.[name]}
      onBlur={formikProps?.handleBlur?.(name)}
      onChangeText={formikProps?.handleChange?.(name)}
      value={formikProps?.values?.[name]}
      {...props}
    />
  );
}
