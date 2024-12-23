import React from "react";

type SmartInputIntProps = React.ComponentProps<"input"> & {
  allowIntType?: "both" | "negative" | "positive";
  min?: number;
  max?: number;
  disabled?: boolean;
  delay?: number;
  input?: number;
  onInputChange?: (v: number) => void;
};

const SmartInputInt: React.FunctionComponent<SmartInputIntProps> = ({
  input,
  min,
  max,
  delay = 2000,
  allowIntType = "both",
  onInputChange,
  className = "focus-visible:outline-none",
  ...props
}) => {
  console.log(input, min, max);
  if (min != undefined && max != undefined && min > max)
    throw new Error("min > max");

  if (input != undefined && min != undefined && min - input > 0)
    throw new Error("min > input");

  if (input != undefined && max != undefined && input > max)
    throw new Error("input > max");

  const defaultValue = React.useMemo(() => {
    if (input) return input.toString();
    if (max == undefined) {
      if (min != undefined) return min.toString();
      return "0";
    } else if (min == undefined) {
      if (max != undefined) return max.toString();
      return "0";
    } else {
      const avg = Math.ceil((max - min) / 2);
      return (min + avg).toString();
    }
  }, [input, max, min]);

  const [value, setValue] = React.useState<string>(defaultValue);

  const [allowNumberType, setAllowNumberType] = React.useState<
    "both" | "negative" | "positive"
  >(allowIntType);

  React.useEffect(() => {
    if (min != undefined && max == undefined) {
      setAllowNumberType(min < 0 ? "both" : "positive");
    } else if (max != undefined && min == undefined) {
      setAllowNumberType(max < 0 ? "negative" : "both");
    } else if (max != undefined && min != undefined) {
      if (min < 0 && max >= 0) {
        setAllowNumberType("both");
      } else if (max < 0) {
        setAllowNumberType("negative");
      } else if (min >= 0) {
        setAllowNumberType("positive");
      }
    }
  }, [max, min]);

  React.useEffect(() => {
    if (onInputChange) {
      onInputChange(parseInt(value));
    }
    let timer: NodeJS.Timeout;

    if (value == "-" || value == "") {
      timer = setTimeout(() => {
        setValue(defaultValue);
      }, delay);
    }
    return () => clearTimeout(timer);
  }, [value, onInputChange, delay, defaultValue]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue: string = e.target.value;
    const regex =
      allowNumberType == "both"
        ? /^-?\d*$/
        : allowNumberType == "positive"
        ? /^\d*$/
        : /^-\d*$/;

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

    //fix here
    console.log("regex", allowIntType, regex);
    let newValue: string;
    if (regex.test(inputValue)) {
      console.log("regex true");

      if (min != undefined && min > parseInt(inputValue)) {
        newValue = min.toString();
      } else if (max != undefined && max < parseInt(inputValue)) {
        newValue = max.toString();
      } else {
        newValue = inputValue;
      }
    } else {
      console.log("regex false");
      // console.log("substring", inputValue.substring(0, inputValue.length - 1));
      // console.log("negative", negative);

      newValue = inputValue.substring(0, inputValue.length - 1);
      // if (negative) {
      //   newValue = inputValue.substring(0, inputValue.length - 1);
      // } else {
      //   newValue = min?.toString() || defaultValue.toString();
      // }
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
