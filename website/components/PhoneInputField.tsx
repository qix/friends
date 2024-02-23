import PhoneInput from "react-phone-number-input";
import { useField } from "formik";
import "react-phone-number-input/style.css";

export const PhoneInputField = (props: {
  id: string;
  name: string;
  className: string;
}) => {
  const [field, meta, helpers] = useField(props.name);

  return (
    <PhoneInput
      {...props}
      {...field}
      value={field.value}
      defaultCountry="US"
      onChange={(value) => {
        helpers.setValue(value);
      }}
    />
  );
};
