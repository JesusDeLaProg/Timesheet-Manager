import { inject, injectable } from "inversify";

import { ICrudResult } from "../../../../types/viewmodels";
import Models from "../../constants/symbols/models";
import { CrudResult } from "../../infrastructure/utils/crud-result";
import { IAuthController } from "../../interfaces/controllers";
import { UserModel } from "../../interfaces/models";

@injectable()
export class AuthController implements IAuthController {
  constructor(@inject(Models.User) private User: UserModel) {}

  public async login(
    username: string,
    password: string
  ): Promise<ICrudResult<string>> {
    const user = await this.User.findOne({ username });
    if (!user || !user.checkPassword(password)) {
      throw CrudResult.Failure(
        new Error("Nom d'usager ou mot de passe invalide.")
      );
    }
    if (!user.isActive) {
      throw CrudResult.Failure(
        new Error(
          "Ce compte utilisateur est désactivé. " +
            "Veuillez réactiver ce compte ou vous connecter avec un autre compte."
        )
      );
    }
    // Create and sign JWT.
    return CrudResult.Success(null /* JWT */);
  }
}
