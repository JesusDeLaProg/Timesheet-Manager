import { unitOfTime } from "moment";
import { SchemaTypeOpts } from "mongoose";
export default function datecompare(startDate: (doc: any) => Date, endDate: (doc: any) => Date, granularity: unitOfTime.StartOf, inclusivity: "()" | "[]" | "(]" | "[)", message: string): SchemaTypeOpts.ValidateOpts;
//# sourceMappingURL=datecompare.d.ts.map