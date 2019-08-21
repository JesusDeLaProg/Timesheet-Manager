import { Document, Error, Model as ModelType } from "mongoose";

import {
  CrudResult,
  QueryOptions,
  IController
} from "../../interfaces/controllers";

export abstract class AbstractController<T extends Document>
  implements IController<T> {
  constructor(private Model: ModelType<T>) {}

  getById(id: string): CrudResult<T> {
    throw new Error("Method not implemented.");
  }

  getAll(options?: QueryOptions): CrudResult<T[]> {
    throw new Error("Method not implemented.");
  }

  count(): CrudResult<number> {
    throw new Error("Method not implemented.");
  }

  validate(document: T): CrudResult<Error.ValidationError> {
    throw new Error("Method not implemented.");
  }

  save(document: T): CrudResult<T | Error.ValidationError> {
    throw new Error("Method not implemented.");
  }

  deleteById(id: string): CrudResult {
    throw new Error("Method not implemented.");
  }
}
