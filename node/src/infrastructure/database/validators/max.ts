import moment from "moment";
import { SchemaTypeOpts } from "mongoose";

export default function max(
  maximum: number | Date,
  message: string,
  equal: boolean = false
): SchemaTypeOpts.ValidateOpts {
  if (maximum instanceof Date) {
    return {
      msg: message,
      type: "DateMaximumValidator",
      validator(value: Date) {
        return equal
          ? moment(value).isSameOrBefore(maximum)
          : moment(value).isBefore(maximum);
      }
    };
  } else {
    return {
      msg: message,
      type: "NumberMaximumValidator",
      validator(value: number) {
        return equal ? value >= maximum : value > maximum;
      }
    };
  }
}
