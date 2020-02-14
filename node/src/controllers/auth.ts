import fs from "fs";
import { inject, injectable } from "inversify";
import jwt from "jsonwebtoken";
import path from "path";

import { ICrudResult } from "../../../types/viewmodels";
import Models from "../constants/symbols/models";
import { CrudResult } from "../infrastructure/utils/crud-result";
import { HasHttpCode } from "../infrastructure/utils/has-http-code";
import { IAuthController } from "../interfaces/controllers";
import { UserModel } from "../interfaces/models";
import { JWTPayload } from "../interfaces/routers";

@injectable()
export class AuthController implements IAuthController {
  private readonly _jwtKeyOrSecret: string | Buffer;

  constructor(@inject(Models.User) private User: UserModel) {
    this._jwtKeyOrSecret =
      process.env.JWTSECRET ||
      fs.readFileSync(path.resolve(process.cwd(), "keys/jwt/key"));
  }

  /**
   * Validates the username and password, then issues a JWT if those match.
   * The returned JWT contains only the user's id, which is enough to prove identity.
   * @param {string} username
   * @param {string} password
   * @returns {Promise<ICrudResult<string>>}
   * @throws 400 Error if credentials don't match.
   * @throws 401 Error if credentials match, but the account is deactivated.
   * @memberof AuthController
   */
  public async login(
    username: string,
    password: string
  ): Promise<ICrudResult<string>> {
    const user = await this.User.findOne({ username });
    if (!user || !user.checkPassword(password)) {
      const error = new Error("Nom d'usager ou mot de passe invalide.");
      (error as HasHttpCode).code = 400;
      throw CrudResult.Failure(error);
    }
    if (!user.isActive) {
      const error = new Error(
        "Ce compte utilisateur est désactivé. " +
          "Veuillez réactiver ce compte ou vous connecter avec un autre compte."
      );
      (error as HasHttpCode).code = 401;
      throw CrudResult.Failure(error);
    }
    const jwtoken = this.createJWT({
      user: user.id
    });
    return CrudResult.Success(jwtoken);
  }

  /**
   * Creates a JWT with the desired payload.
   * @param {JWTPayload} payload
   * @returns {string}
   * @memberof AuthController
   */
  public createJWT(payload: JWTPayload): string {
    return jwt.sign(payload, this._jwtKeyOrSecret, {
      algorithm: process.env.JWTSECRET ? "HS256" : process.env.JWTALGO,
      expiresIn: process.env.SESSIONTIMEOUT,
      issuer: process.env.APPNAME
    });
  }
}
