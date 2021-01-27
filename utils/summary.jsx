import { convertFormat } from 'utils/date';

const multiValue = ([key, value], summaryInline) =>
  summaryInline ? (
    <span key={key}>{value} </span>
  ) : (
    <div key={key}>
      <span>{value}</span>
      <br />
    </div>
  );

const address = ({ address, postcode }, name, label) =>
  address && {
    key: name,
    title: label,
    value: (
      <>
        {address.split(', ').map((value) => (
          <div key={value}>
            <span>{value}</span>
            <br />
          </div>
        ))}
        <div>{postcode}</div>
      </>
    ),
  };

export const formatData = (
  { component, options, name, label, summaryInline },
  formData
) => {
  if (component === 'AddressLookup') {
    return address(formData[name], name, label);
  }
  if (component === 'Radios' || component === 'Select') {
    const stepOptions =
      typeof options === 'function' ? options(formData) : options;
    return {
      key: name,
      title: label,
      value:
        typeof stepOptions[0] === 'string'
          ? formData[name]
          : stepOptions.find((option) => option.value === formData[name])?.text,
    };
  }
  if (component === 'DateInput') {
    return {
      key: name,
      title: label,
      value: convertFormat(formData[name]),
    };
  }
  return {
    key: name,
    title: label,
    value: Array.isArray(formData[name])
      ? formData[name]
          .filter(Boolean)
          .map((v) => multiValue(v.split('/').pop()))
      : typeof formData[name] === 'object'
      ? Object.entries(formData[name])
          .filter(([, value]) => Boolean(value))
          .map((entry) => multiValue(entry, summaryInline))
      : typeof formData[name] === 'boolean'
      ? JSON.stringify(formData[name])
      : formData[name],
  };
};
