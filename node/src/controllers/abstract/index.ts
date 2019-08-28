import { injectable } from "inversify";
import { Document, Error, Model as ModelType } from "mongoose";

import { CrudResult, IViewInterface } from "../../../../types/viewmodels";
import { IController, QueryOptions } from "../../interfaces/controllers";

@injectable()
export abstract class AbstractController<T extends IViewInterface>
  implements IController<T> {
  constructor(private Model: ModelType<T & Document>) {}

  public getById(id: string): Promise<CrudResult<T>> {
    throw new Error("Method not implemented.");
  }

  public getAll(options?: QueryOptions): Promise<CrudResult<T[]>> {
    throw new Error("Method not implemented.");
  }

  public count(): Promise<CrudResult<number>> {
    throw new Error("Method not implemented.");
  }

  public validate(document: T): Promise<CrudResult<Error.ValidationError>> {
    throw new Error("Method not implemented.");
  }

  public save(document: T): Promise<CrudResult<T | Error.ValidationError>> {
    throw new Error("Method not implemented.");
  }

  public deleteById(id: string): Promise<CrudResult> {
    throw new Error("Method not implemented.");
  }
}
