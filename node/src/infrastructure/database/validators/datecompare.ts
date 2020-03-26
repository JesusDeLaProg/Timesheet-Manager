import moment, { unitOfTime } from "moment";
import { SchemaTypeOpts, Types } from "mongoose";

export default function datecompare(
  startDate: (doc: any) => Date,
  endDate: (doc: any) => Date,
  granularity: unitOfTime.StartOf,
  inclusivity: "()" | "[]" | "(]" | "[)",
  message: string
): SchemaTypeOpts.ValidateOpts {
  return {
    msg: message,
    type: "DateComparisonValidator",
    validator(this: Types.Embedded, value: Date) {
      return moment(value).isBetween(
        startDate(this.ownerDocument() as any),
        endDate(this.ownerDocument() as any),
        granularity,
        inclusivity
      );
    }
  };
}
