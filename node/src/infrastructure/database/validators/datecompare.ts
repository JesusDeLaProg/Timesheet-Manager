import moment from "moment";
import { SchemaTypeOpts, Types } from "mongoose";

export default function datecompare(
  startDate: (doc: any) => Date,
  endDate: (doc: any) => Date,
  inclusivity: "()" | "[]" | "(]" | "[)",
  message: string
): SchemaTypeOpts.ValidateOpts {
  return {
    type: "DateComparisonValidator",
    msg: message,
    validator(this: Types.Embedded, value: Date) {
      return moment(value).isBetween(
        startDate(this.ownerDocument() as any),
        endDate(this.ownerDocument() as any),
        undefined,
        inclusivity
      );
    }
  };
}
