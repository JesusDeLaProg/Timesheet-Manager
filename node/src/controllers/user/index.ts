import { injectable, inject } from "inversify";
import { Error } from "mongoose";

import { AbstractController } from "../abstract";
import { QueryOptions, IUserController } from "../../interfaces/controllers";
import { UserModel } from "../../interfaces/models";
import Models from "../../constants/symbols/models";
import { IViewUser, CrudResult } from "../../../../types/viewmodels";

@injectable()
export class UserController extends AbstractController<IViewUser>
  implements IUserController {
  constructor(@inject(Models.User) private User: UserModel) {
    super(User);
  }

  getById(id: string): Promise<CrudResult<IViewUser>> {
    throw new Error("Method not implemented.");
  }
  getAll(options?: QueryOptions | undefined): Promise<CrudResult<IViewUser[]>> {
    throw new Error("Method not implemented.");
  }
  count(): Promise<CrudResult<number>> {
    throw new Error("Method not implemented.");
  }
  validate(document: IViewUser): Promise<CrudResult<Error.ValidationError>> {
    throw new Error("Method not implemented.");
  }
  save(
    document: IViewUser
  ): Promise<CrudResult<IViewUser | Error.ValidationError>> {
    throw new Error("Method not implemented.");
  }
  deleteById(id: string): Promise<CrudResult<any>> {
    throw new Error("Method not implemented.");
  }
}
