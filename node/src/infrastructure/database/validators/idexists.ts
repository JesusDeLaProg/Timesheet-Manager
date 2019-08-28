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
      } // Empty ID is valid.

      const id =
        value instanceof Types.ObjectId ? value : new Types.ObjectId(value);

      const result = await mongoose
        .model(modelName)
        .countDocuments({ _id: id });

      return result === 1;
    }
  };
}
