import mongoose, { SchemaTypeOpts, Document } from "mongoose";

export default function unique(
  modelName: string,
  fieldName: string,
  message: string
): SchemaTypeOpts.AsyncPromiseValidationOpts {
  return {
    type: "UniqueValidator",
    msg: message,
    validator: async function(this: Document, value: any) {
      if (mongoose.modelNames().indexOf(modelName) === -1) {
        throw new Error(`modelName "${modelName}" does not exist.`);
      }
      const filter = {
        [fieldName]: value
      };
      if (this._id) filter["_id"] = { $ne: this._id };

      const result = await mongoose.model(modelName).countDocuments(filter);
      return result === 0;
    }
  };
}
