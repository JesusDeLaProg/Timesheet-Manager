import { injectable, inject } from "inversify";

import { IAuthController } from "../../interfaces/controllers";
import { UserModel } from "../../interfaces/models";
import Models from "../../constants/symbols/models";
import { CrudResult } from "../../../../types/viewmodels";

@injectable()
export class AuthController implements IAuthController {
  constructor(@inject(Models.User) private User: UserModel) {}

  login(username: string, password: string): Promise<CrudResult<string>> {
    throw new Error("Method not implemented.");
  }
}
