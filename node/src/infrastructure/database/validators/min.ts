import { SchemaTypeOpts } from "mongoose";

export default function min(
  minimum: number,
  message: string,
  equal: boolean = false
): SchemaTypeOpts.ValidateOpts {
  return {
    msg: message,
    type: "NumberMinimumValidator",
    validator(value: number) {
      return equal ? value >= minimum : value > minimum;
    }
  };
}
