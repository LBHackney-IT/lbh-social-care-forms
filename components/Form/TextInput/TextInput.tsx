import cx from 'classnames';

import type { TextInput as Props } from 'components/Form/types';
import { FieldErrorMessage } from '../FieldErrorMessage/FieldErrorMessage';

const TextInput = ({
  label,
  hint,
  name,
  register,
  rules,
  error,
  type = 'text',
  inputClassName,
  labelSize = 'm',
  required,
  width,
  ...otherProps
}: Props): React.ReactElement => (
  <div
    className={cx('govuk-form-group lbh-form-group', {
      'govuk-form-group--error': error,
    })}
  >
    <label className={`govuk-label lbh-label`} htmlFor={name}>
      {label} {required && <span className="govuk-required">*</span>}
    </label>
    {hint && (
      <span id={`${name}-hint`} className="govuk-hint lbh-hint">
        {hint}
      </span>
    )}

    <FieldErrorMessage error={error} label={label} />

    <input
      className={cx(`govuk-input lbh-input`, inputClassName, {
        [`govuk-input--width-${width}`]: width,
        'lbh-input--error': error,
      })}
      id={name}
      data-testid={name}
      name={name}
      type={type}
      ref={rules ? register?.(rules) : register}
      aria-describedby={hint && `${name}-hint`}
      {...otherProps}
    />
  </div>
);

export default TextInput;
