import { Document, Error, Model as ModelType } from "mongoose";

import { QueryOptions, IController } from "../../interfaces/controllers";
import { IViewInterface, CrudResult } from "../../../../types/viewmodels";

export abstract class AbstractController<T extends IViewInterface>
  implements IController<T> {
  constructor(private Model: ModelType<T & Document>) {}

  getById(id: string): Promise<CrudResult<T>> {
    throw new Error("Method not implemented.");
  }

  getAll(options?: QueryOptions): Promise<CrudResult<T[]>> {
    throw new Error("Method not implemented.");
  }

  count(): Promise<CrudResult<number>> {
    throw new Error("Method not implemented.");
  }

  validate(document: T): Promise<CrudResult<Error.ValidationError>> {
    throw new Error("Method not implemented.");
  }

  save(document: T): Promise<CrudResult<T | Error.ValidationError>> {
    throw new Error("Method not implemented.");
  }

  deleteById(id: string): Promise<CrudResult> {
    throw new Error("Method not implemented.");
  }
}
