import { injectable, inject } from "inversify";
import { Error } from "mongoose";

import { AbstractController } from "../abstract";
import {
  CrudResult,
  QueryOptions,
  IUserController
} from "../../interfaces/controllers";
import { UserModel, UserDocument } from "../../interfaces/models";
import Models from "../../constants/symbols/models";

@injectable()
export class UserController extends AbstractController<UserDocument>
  implements IUserController {
  constructor(@inject(Models.User) private User: UserModel) {
    super(User);
  }

  getById(id: string): CrudResult<UserDocument> {
    throw new Error("Method not implemented.");
  }
  getAll(options?: QueryOptions | undefined): CrudResult<UserDocument[]> {
    throw new Error("Method not implemented.");
  }
  count(): CrudResult<number> {
    throw new Error("Method not implemented.");
  }
  validate(document: UserDocument): CrudResult<Error.ValidationError> {
    throw new Error("Method not implemented.");
  }
  save(
    document: UserDocument
  ): CrudResult<UserDocument | Error.ValidationError> {
    throw new Error("Method not implemented.");
  }
  deleteById(id: string): CrudResult<any> {
    throw new Error("Method not implemented.");
  }
}
