import moment from "moment";
import { SchemaTypeOpts } from "mongoose";

export default function min(
  minimum: number | Date,
  message: string,
  equal: boolean = false
): SchemaTypeOpts.ValidateOpts {
  if (minimum instanceof Date) {
    return {
      msg: message,
      type: "DateMinimumValidator",
      validator(value: Date) {
        return equal
          ? moment(value).isSameOrAfter(minimum)
          : moment(value).isAfter(minimum);
      }
    };
  } else {
    return {
      msg: message,
      type: "NumberMinimumValidator",
      validator(value: number) {
        return equal ? value >= minimum : value > minimum;
      }
    };
  }
}
