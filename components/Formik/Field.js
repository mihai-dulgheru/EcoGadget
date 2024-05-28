import { get } from 'lodash';
import { forwardRef } from 'react';
import { Input } from '../UI';

const Field = forwardRef(({ formikProps, name, ...props }, ref) => {
  const value = get(formikProps.values, name).toString();
  const error = get(formikProps.errors, name);
  const touched = get(formikProps.touched, name);

  return (
    <Input
      isInvalid={touched && !!error}
      onBlur={formikProps.handleBlur(name)}
      onChangeText={formikProps.handleChange(name)}
      ref={ref}
      value={value}
      {...props}
    />
  );
});

export default Field;
