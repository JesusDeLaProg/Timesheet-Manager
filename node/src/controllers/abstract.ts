import { injectable } from "inversify";
import {
  Document,
  DocumentQuery,
  Error as MongooseError,
  Model as ModelType
} from "mongoose";

import {
  ICrudResult,
  IViewInterface,
  IViewUser
} from "../../../types/viewmodels";
import { CrudResult } from "../infrastructure/utils/crud-result";
import { IController, QueryOptions, ObjectId } from "../interfaces/controllers";
import { HasHttpCode } from "../infrastructure/utils/has-http-code";
import { UserModel, UserDocument } from "../interfaces/models";

@injectable()
export abstract class AbstractController<T extends IViewInterface>
  implements IController<T> {
  constructor(
    private Model: ModelType<T & Document>,
    private User: UserModel
  ) {}

  public async getById(
    authenticatedUserId: ObjectId,
    id: string
  ): Promise<ICrudResult<T>> {
    if (!authenticatedUserId) {
      throw this.get401Error();
    }
    const result = await this.Model.findById(id);
    if (!result) {
      throw CrudResult.Failure(
        new Error(`Cannot find ${this.Model.name} with _id ${id}`)
      );
    }
    if (
      this.validateReadPermissions(
        await this.getUser(authenticatedUserId),
        await this.getResourceOwner(result)
      )
    ) {
      return CrudResult.Success(result);
    } else {
      throw this.get403Error();
    }
  }

  public async getAll(
    authenticatedUserId: ObjectId,
    options?: QueryOptions
  ): Promise<ICrudResult<T[]>> {
    if (
      this.validateReadPermissions(
        await this.getUser(authenticatedUserId),
        null
      )
    ) {
      let query = this.Model.find();
      query = this.applyQueryOptions(query, options);
      const result = await query;
      return CrudResult.Success(result);
    } else {
      throw this.get403Error();
    }
  }

  public async count(
    authenticatedUserId: ObjectId
  ): Promise<ICrudResult<number>> {
    if (
      this.validateReadPermissions(
        await this.getUser(authenticatedUserId),
        null
      )
    ) {
      const result = await this.Model.estimatedDocumentCount();
      return CrudResult.Success(result);
    } else {
      throw this.get403Error();
    }
  }

  public async validate(
    authenticatedUserId: ObjectId,
    input: T
  ): Promise<ICrudResult<MongooseError.ValidationError>> {
    const { document, resourceOwner } = await this.objectToDocument(input);
    let authorized = false;
    if (input._id) {
      authorized = this.validateUpdatePermissions(
        await this.getUser(authenticatedUserId),
        resourceOwner
      );
    } else {
      authorized = this.validateCreatePermissions(
        await this.getUser(authenticatedUserId),
        resourceOwner
      );
    }
    if (authorized) {
      try {
        await document.validate();
        return CrudResult.Success(null);
      } catch (error) {
        if (error instanceof MongooseError.ValidationError) {
          (error as MongooseError.ValidationError & {
            code: number;
          }).code = 400;
          return CrudResult.Failure(error);
        } else {
          throw error;
        }
      }
    } else {
      throw this.get403Error();
    }
  }

  public async save(
    authenticatedUserId: ObjectId,
    input: T
  ): Promise<ICrudResult<T | MongooseError.ValidationError>> {
    const { document, resourceOwner } = await this.objectToDocument(input);
    let authorized = false;
    if (input._id) {
      authorized = this.validateUpdatePermissions(
        await this.getUser(authenticatedUserId),
        resourceOwner
      );
    } else {
      authorized = this.validateCreatePermissions(
        await this.getUser(authenticatedUserId),
        resourceOwner
      );
    }
    if (authorized) {
      try {
        const result = await document.save();
        return CrudResult.Success(result);
      } catch (error) {
        if (error instanceof MongooseError.ValidationError) {
          (error as MongooseError.ValidationError & {
            code: number;
          }).code = 400;
          return CrudResult.Failure(error);
        } else {
          throw error;
        }
      }
    } else {
      throw this.get403Error();
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

  protected async objectToDocument(
    input: T
  ): Promise<{ resourceOwner: UserDocument | null; document: T & Document }> {
    if (input._id) {
      const result = await this.Model.findById(input._id);

      if (!result) {
        throw CrudResult.Failure(
          new Error(`Cannot find document with _id: "${input._id}"`)
        );
      }
      const resourceOwner = await this.getResourceOwner(result);
      delete input._id;
      Object.assign(result, input);
      return {
        resourceOwner,
        document: result
      };
    } else {
      delete input._id;
      const result = new this.Model(input);
      return {
        resourceOwner: await this.getResourceOwner(result),
        document: result
      };
    }
  }

  protected async getUser(userId: ObjectId) {
    const user = await this.User.findById(userId);
    if (!user) {
      throw this.get401Error();
    }
    return user;
  }

  protected abstract async getResourceOwner(
    resource: T
  ): Promise<UserDocument | null>;
  protected abstract validateReadPermissions(
    authenticatedUser: IViewUser,
    resourceOwner: IViewUser | null
  ): boolean;
  protected abstract validateUpdatePermissions(
    authenticatedUser: IViewUser,
    resourceOwner: IViewUser | null
  ): boolean;
  protected abstract validateCreatePermissions(
    authenticatedUser: IViewUser,
    resourceOwner: IViewUser | null
  ): boolean;

  protected get401Error() {
    const error = new Error("Unauthorized");
    (error as HasHttpCode).code = 401;
    return CrudResult.Failure(error);
  }

  protected get403Error() {
    const error = new Error("Forbidden");
    (error as HasHttpCode).code = 403;
    return CrudResult.Failure(error);
  }
}
