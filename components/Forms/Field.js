import { forwardRef } from 'react';
import { Input } from '../UI';

const Field = forwardRef(({ formikProps, name, ...props }, ref) => (
  <Input
    isInvalid={formikProps?.touched?.[name] && formikProps?.errors?.[name]}
    onBlur={formikProps?.handleBlur?.(name)}
    onChangeText={formikProps?.handleChange?.(name)}
    ref={ref}
    value={formikProps?.values?.[name]}
    {...props}
  />
));

export default Field;
