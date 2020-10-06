import { SchemaTypeOpts } from "mongoose";

export default function arrayLength(
  min: number | null,
  max: number | null,
  message: string
): SchemaTypeOpts.ValidateOpts {
  return {
    msg: message,
    type: "ArrayLengthValidator",
    validator(value: any[]) {
      let test = !!value;
      if (test && min !== null) {
        test = test && value.length >= min;
      }
      if (test && max !== null) {
        test = test && value.length <= max;
      }
      return test;
    },
  };
}
