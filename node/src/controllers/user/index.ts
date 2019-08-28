import { inject, injectable } from "inversify";
import { Error } from "mongoose";

import { CrudResult, IViewUser } from "../../../../types/viewmodels";
import Models from "../../constants/symbols/models";
import { IUserController, QueryOptions } from "../../interfaces/controllers";
import { UserModel } from "../../interfaces/models";
import { AbstractController } from "../abstract";

@injectable()
export class UserController extends AbstractController<IViewUser>
  implements IUserController {
  constructor(@inject(Models.User) private User: UserModel) {
    super(User);
  }

  public getById(id: string): Promise<CrudResult<IViewUser>> {
    throw new Error("Method not implemented.");
  }
  public getAll(
    options?: QueryOptions | undefined
  ): Promise<CrudResult<IViewUser[]>> {
    throw new Error("Method not implemented.");
  }
  public count(): Promise<CrudResult<number>> {
    throw new Error("Method not implemented.");
  }
  public validate(
    document: IViewUser
  ): Promise<CrudResult<Error.ValidationError>> {
    throw new Error("Method not implemented.");
  }
  public save(
    document: IViewUser
  ): Promise<CrudResult<IViewUser | Error.ValidationError>> {
    throw new Error("Method not implemented.");
  }
  public deleteById(id: string): Promise<CrudResult<any>> {
    throw new Error("Method not implemented.");
  }
}
