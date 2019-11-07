import { injectable } from "inversify";
import {
  Document,
  DocumentQuery,
  Error as MongooseError,
  Model as ModelType
} from "mongoose";

import { ICrudResult, IViewInterface } from "../../../types/viewmodels";
import { CrudResult } from "../infrastructure/utils/crud-result";
import { IController, QueryOptions } from "../interfaces/controllers";

@injectable()
export abstract class AbstractController<T extends IViewInterface>
  implements IController<T> {
  constructor(private Model: ModelType<T & Document>) {}

  public async getById(id: string): Promise<ICrudResult<T>> {
    const result = await this.Model.findById(id);
    if (!result) {
      throw CrudResult.Failure(
        new Error(`Cannot find ${this.Model.name} with _id ${id}`)
      );
    }
    return CrudResult.Success(result);
  }

  public async getAll(options?: QueryOptions): Promise<ICrudResult<T[]>> {
    let query = this.Model.find();
    query = this.applyQueryOptions(query, options);
    const result = await query;
    return CrudResult.Success(result);
  }

  public async count(): Promise<ICrudResult<number>> {
    const result = await this.Model.estimatedDocumentCount();
    return CrudResult.Success(result);
  }

  public async validate(
    input: T
  ): Promise<ICrudResult<MongooseError.ValidationError>> {
    const document = await this.objectToDocument(input);
    try {
      await document.validate();
      return CrudResult.Success(null);
    } catch (error) {
      if (error instanceof MongooseError.ValidationError) {
        (error as MongooseError.ValidationError & { code: number }).code = 400;
        return CrudResult.Failure(error);
      } else {
        throw error;
      }
    }
  }

  public async save(
    input: T
  ): Promise<ICrudResult<T | MongooseError.ValidationError>> {
    const document = await this.objectToDocument(input);
    try {
      const result = await document.save();
      return CrudResult.Success(result);
    } catch (error) {
      if (error instanceof MongooseError.ValidationError) {
        (error as MongooseError.ValidationError & { code: number }).code = 400;
        return CrudResult.Failure(error);
      } else {
        throw error;
      }
    }
  }

  protected applyQueryOptions<U, V extends Document>(
    query: DocumentQuery<U, V>,
    options?: QueryOptions
  ): DocumentQuery<U, V> {
    if (options) {
      if (options.limit) {
        query = query.limit(options.limit);
      }
      if (options.skip) {
        query = query.skip(options.skip);
      }
      if (options.sort) {
        query = query.sort(options.sort);
      }
    }
    return query;
  }

  protected async objectToDocument(input: T): Promise<T & Document> {
    if (input._id) {
      const result = await this.Model.findById(input._id);

      if (!result) {
        throw CrudResult.Failure(
          new Error(`Cannot find document with _id: "${input._id}"`)
        );
      }

      delete input._id;
      Object.assign(result, input);
      return result;
    } else {
      delete input._id;
      return new this.Model(input);
    }
  }
}
