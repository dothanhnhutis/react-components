import React from "react";

type SmartInputIntProps = React.ComponentProps<"input"> & {
  allowNegative?: boolean;
  min?: number;
  max?: number;
  disabled?: boolean;
  delay?: number;
  input?: string;
  onInputChange?: (v: string) => void;
};

const SmartInputInt: React.FunctionComponent<SmartInputIntProps> = ({
  input,
  min,
  max,
  delay = 1000,
  allowNegative = true,
  onInputChange,
  className = "focus-visible:outline-none",
  ...props
}) => {
  const [value, setValue] = React.useState<string>(input || "");
  const [negative, setNegative] = React.useState<boolean>(allowNegative);

  if (min && max && min > max) throw new Error("min > max");

  React.useEffect(() => {
    if (min && min < 0) {
      setNegative(true);
    }

    if (max && max < 0) {
      setNegative(true);
    }

    if (max && min && (max < 0 || min < 0)) {
      setNegative(false);
    }
  }, [max, min]);
  console.log(negative);

  React.useEffect(() => {
    if (onInputChange) {
      onInputChange(value);
    }
    let timer: NodeJS.Timeout;
    if (value == "-") {
      timer = setTimeout(() => {
        setValue("");
      }, delay);
    }
    return () => clearTimeout(timer);
  }, [value, onInputChange, delay]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue: string = e.target.value;
    const regex = negative ? /^-?\d*$/ : /^\d*$/;

    if (inputValue.startsWith("-0")) {
      setValue("0");
      return;
    }

    if (inputValue.startsWith("0") && inputValue.length == 2) {
      if (inputValue == "0-") {
        setValue("0");
      } else {
        setValue(inputValue.slice(-1));
      }
      return;
    }

    let newValue: string;
    if (regex.test(inputValue)) {
      if (min && min > parseInt(inputValue)) {
        newValue = min.toString();
      } else if (max && max < parseInt(inputValue)) {
        newValue = max.toString();
      } else {
        newValue = inputValue;
      }
    } else {
      newValue = inputValue.substring(0, inputValue.length - 1);
    }
    setValue(newValue);
  };

  return (
    <input
      className={className}
      {...props}
      value={value}
      onChange={handleOnChange}
    />
  );
};

export default SmartInputInt;
