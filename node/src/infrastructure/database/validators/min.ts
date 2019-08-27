import { SchemaTypeOpts } from "mongoose";

export default function min(
  number: number,
  message: string,
  equal: boolean = false
): SchemaTypeOpts.ValidateOpts {
  return {
    type: "NumberMinimumValidator",
    msg: message,
    validator: function(value: number) {
      return equal ? value >= number : value > number;
    }
  };
}
