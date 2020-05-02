import { Query, Schema } from "mongoose";

type LoggedQuery<T> = Query<T> & { _startTime: number };

export default function setup<T>(schemaName: string, schema: Schema<T>) {
  schema.pre("find", function (this: LoggedQuery<T[]>) {
    this._startTime = Date.now();
  });
  schema.post("find", function (this: LoggedQuery<T[]>) {
    process.stdout.write(
      "Find Query Time (" +
        schemaName +
        ") : " +
        (Date.now() - this._startTime) +
        " ms\n"
    );
  });
  schema.pre("findOne", function (this: LoggedQuery<T[]>) {
    this._startTime = Date.now();
  });
  schema.post("findOne", function (this: LoggedQuery<T[]>) {
    process.stdout.write(
      "FindOne Query Time (" +
        schemaName +
        ") : " +
        (Date.now() - this._startTime) +
        " ms\n"
    );
  });
}
