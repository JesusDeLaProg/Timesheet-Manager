import { inject, injectable } from "inversify";

import { CrudResult } from "../../../../types/viewmodels";
import Models from "../../constants/symbols/models";
import { IAuthController } from "../../interfaces/controllers";
import { UserModel } from "../../interfaces/models";

@injectable()
export class AuthController implements IAuthController {
  constructor(@inject(Models.User) private User: UserModel) {}

  public login(
    username: string,
    password: string
  ): Promise<CrudResult<string>> {
    throw new Error("Method not implemented.");
  }
}
