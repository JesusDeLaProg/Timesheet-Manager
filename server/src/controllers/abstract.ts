import { injectable } from "inversify";
import {
  Document,
  DocumentQuery,
  Error as MongooseError,
  Model as ModelType,
} from "mongoose";

import {
  ICrudResult,
  IViewInterface,
  IViewUser,
} from "../../../types/viewmodels";
import { CrudResult } from "../infrastructure/utils/crud-result";
import { HasHttpCode } from "../infrastructure/utils/has-http-code";
import {
  IController,
  IQueryOptions,
  ObjectId,
} from "../interfaces/controllers";
import { UserDocument, UserModel } from "../interfaces/models";

@injectable()
export abstract class AbstractController<T extends IViewInterface>
  implements IController<T> {
  constructor(
    private Model: ModelType<T & Document>,
    protected User: UserModel
  ) {}

  /**
   * Returns a document retrieved with a given id.
   * @param {ObjectId} authenticatedUserId
   * @param {string} id
   * @returns {Promise<ICrudResult<T>>}
   * @throws 401 Error if there is no authenticated user.
   * @throws 403 Error if the authenticated user doesn't have permissions to read the requested item.
   * @memberof AbstractController
   */
  public async getById(
    authenticatedUserId: ObjectId,
    id: string
  ): Promise<ICrudResult<T>> {
    const result = await this.Model.findById(id);
    if (!result) {
      const error = new Error(`Cannot find ${this.Model.name} with _id ${id}`);
      (error as HasHttpCode).code = 404;
      throw CrudResult.Failure(error);
    }
    if (
      this.validateReadPermissions(
        await this.getUser(authenticatedUserId),
        await this.getResourceOwner(result)
      )
    ) {
      return CrudResult.Success(result.toJSON());
    } else {
      throw this.get403Error();
    }
  }

  /**
   * Returns all the documents from a collection. Paged with {@link QueryOptions}.
   * @param {ObjectId} authenticatedUserId
   * @param {IQueryOptions} [options]
   * @returns {Promise<ICrudResult<T[]>>}
   * @throws 401 Error if there is no authenticated user.
   * @throws 403 Error if the authenticated user doesn't have permissions to read that collection.
   * @memberof AbstractController
   */
  public async getAll(
    authenticatedUserId: ObjectId,
    options?: IQueryOptions
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
      return CrudResult.Success(result.map((o) => o.toJSON()));
    } else {
      throw this.get403Error();
    }
  }

  /**
   * Returns the number of documents in a collection.
   * @param {ObjectId} authenticatedUserId
   * @returns {Promise<ICrudResult<number>>}
   * @throws 401 Error if there is no authenticated user.
   * @throws 40 Error if the authenticated user doesn't have permissions to read that collection.
   * @memberof AbstractController
   */
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

  /**
   * Validates a document using Mongoose validators.
   * @param {ObjectId} authenticatedUserId
   * @param {T} input
   * @returns {Promise<ICrudResult<MongooseError.ValidationError>>}
   * @throws 401 Error if there is no authenticated user.
   * @throws 403 Error if the authenticated user doesn't have
   *         permissions to update or create a document in that collection.
   * @memberof AbstractController
   */
  public async validate(
    authenticatedUserId: ObjectId,
    input: T
  ): Promise<ICrudResult<MongooseError.ValidationError>> {
    const {
      document,
      originalObject,
      resourceOwner: originalResourceOwner,
    } = await this.objectToDocument(input);
    let authorized = false;
    if (originalObject) {
      authorized = this.validateUpdatePermissions(
        await this.getUser(authenticatedUserId),
        originalObject as T,
        document,
        originalResourceOwner
      );
      const newResourceOwner = await this.getResourceOwner(document);
      authorized =
        authorized &&
        (!!originalResourceOwner
          ? !!newResourceOwner &&
            originalResourceOwner.id + "" === newResourceOwner.id + ""
          : true);
    } else {
      authorized = this.validateCreatePermissions(
        await this.getUser(authenticatedUserId),
        document,
        originalResourceOwner
      );
    }
    if (authorized) {
      try {
        await document.validate();
        return CrudResult.Success(null);
      } catch (error) {
        if (error instanceof MongooseError.ValidationError) {
          (error as MongooseError.ValidationError & HasHttpCode).code = 400;
          return CrudResult.Failure(error);
        } else {
          throw error;
        }
      }
    } else {
      throw this.get403Error();
    }
  }

  /**
   * Saves a document after validating it using Mongoose validators.
   * @param {ObjectId} authenticatedUserId
   * @param {T} input
   * @returns {Promise<ICrudResult<T | MongooseError.ValidationError>>} Updated document
   *          if saved successfully, ValidationError otherwise.
   * @throws 401 Error if there is no authenticated user.
   * @throws 403 Error if the authenticated user doesn't have permissions to update or
   *         create a document in that collection.
   * @memberof AbstractController
   */
  public async save(
    authenticatedUserId: ObjectId,
    input: T
  ): Promise<ICrudResult<T | MongooseError.ValidationError>> {
    const {
      document,
      originalObject,
      resourceOwner,
    } = await this.objectToDocument(input);
    let authorized = false;
    if (originalObject) {
      authorized = this.validateUpdatePermissions(
        await this.getUser(authenticatedUserId),
        originalObject as T,
        document,
        resourceOwner
      );
    } else {
      authorized = this.validateCreatePermissions(
        await this.getUser(authenticatedUserId),
        document,
        resourceOwner
      );
    }
    if (authorized) {
      try {
        const result = await document.save();
        return CrudResult.Success(result.toJSON());
      } catch (error) {
        if (error instanceof MongooseError.ValidationError) {
          (error as MongooseError.ValidationError & HasHttpCode).code = 400;
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
    options?: IQueryOptions
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

  /**
   * Transforms an input object to a Mongoose Document.
   * Returns the original document as a plain object,
   * the updated document and the resource owner,
   * retrieved from the original document.
   * @protected
   * @param {T} input
   * @returns {(Promise<{
   *     resourceOwner: UserDocument | null;
   *     originalObject: T | null;
   *     document: T & Document;
   *   }>)}
   * @memberof AbstractController
   */
  protected async objectToDocument(
    input: T
  ): Promise<{
    resourceOwner: UserDocument | null;
    originalObject: T | null;
    document: T & Document;
  }> {
    if (input._id) {
      const result = await this.Model.findById(input._id);

      if (!result) {
        throw CrudResult.Failure(
          new Error(`Cannot find document with _id: "${input._id}"`)
        );
      }
      const originalObject = result.toObject();
      const resourceOwner = await this.getResourceOwner(result);
      delete input._id;
      Object.assign(result, input);
      return {
        resourceOwner,
        originalObject,
        document: result,
      };
    } else {
      delete input._id;
      const result = new this.Model(input);
      return {
        resourceOwner: await this.getResourceOwner(result),
        originalObject: null,
        document: result,
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
    originalObject: T,
    updatedDocument: T & Document,
    resourceOwner: IViewUser | null
  ): boolean;
  protected abstract validateCreatePermissions(
    authenticatedUser: IViewUser,
    updatedDocument: T & Document,
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
