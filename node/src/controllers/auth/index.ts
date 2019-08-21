import { injectable, inject } from "inversify";

import { IAuthController, CrudResult } from "../../interfaces/controllers";
import { UserModel } from "../../interfaces/models";
import Models from "../../constants/symbols/models";

@injectable()
export class AuthController implements IAuthController {
  constructor(@inject(Models.User) private User: UserModel) {}

  login(username: string, password: string): CrudResult<string> {
    throw new Error("Method not implemented.");
  }
}
