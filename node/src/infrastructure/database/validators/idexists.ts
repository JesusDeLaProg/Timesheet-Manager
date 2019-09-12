import { ObjectId } from "bson";
import mongoose, { Document, SchemaTypeOpts, Types } from "mongoose";

export default function idexists(
  modelName: string,
  message: string
): SchemaTypeOpts.AsyncPromiseValidationOpts {
  return {
    msg: message,
    type: "IdExistsValidator",
    async validator(this: Document, value: string | Types.ObjectId) {
      if (mongoose.modelNames().indexOf(modelName) === -1) {
        throw new Error(`modelName "${modelName} does not exist.`);
      }

      if (!value) {
        return true;
      } // Do not validate if there is no id.
      const id = value instanceof ObjectId ? value : new ObjectId(value);

      const result = await mongoose
        .model(modelName)
        .countDocuments({ _id: id });

      return result === 1;
    }
  };
}
