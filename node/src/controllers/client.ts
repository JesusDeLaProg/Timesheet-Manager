import { inject, injectable } from "inversify";
import escapeRegExp from "lodash.escaperegexp";

import { ICrudResult, IViewClient } from "../../../types/viewmodels";
import Models from "../constants/symbols/models";
import { CrudResult } from "../infrastructure/utils/crud-result";
import { IClientController, QueryOptions } from "../interfaces/controllers";
import { ClientModel } from "../interfaces/models";
import { AbstractController } from "./abstract";

@injectable()
export class ClientController extends AbstractController<IViewClient>
  implements IClientController {
  constructor(@inject(Models.Client) private Client: ClientModel) {
    super(Client);
  }

  public async getAllByName(
    name: string,
    options?: QueryOptions | undefined
  ): Promise<ICrudResult<IViewClient[]>> {
    let query = this.Client.find({ name: new RegExp(escapeRegExp(name), "i") });
    query = this.applyQueryOptions(query, options);
    const result = await query;
    return CrudResult.Success(result);
  }
}
