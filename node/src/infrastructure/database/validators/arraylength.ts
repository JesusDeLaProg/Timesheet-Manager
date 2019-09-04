import { SchemaTypeOpts } from "mongoose";

export default function arrayLength(
  min: number | null,
  max: number | null,
  message: string
): SchemaTypeOpts.ValidateOpts {
  return {
    type: "ArrayLengthValidator",
    msg: message,
    validator(value: any[]) {
      let test = !!value;
      if (test && min !== null) {
        test = test && value.length >= min;
      }
      if (test && max !== null) {
        test = test && value.length <= max;
      }
      return test;
    }
  };
}
