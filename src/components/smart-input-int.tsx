import React from "react";

type SmartInputIntProps = React.ComponentProps<"input"> & {
  isNegative?: boolean;
  min?: number;
  max?: number;
  disabled?: boolean;
  delay?: number;
  value?: string;
  onInputChange?: (v: string) => void;
};

const SmartInputInt: React.FunctionComponent<SmartInputIntProps> = (props) => {
  return <input {...props} />;
};

export default SmartInputInt;
