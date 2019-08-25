import { injectable, inject } from "inversify";
import { Error } from "mongoose";

import { AbstractController } from "../abstract";
import { IClientController, QueryOptions } from "../../interfaces/controllers";
import { ClientModel } from "../../interfaces/models";
import Models from "../../constants/symbols/models";
import { IViewClient, CrudResult } from "../../../../types/viewmodels";

@injectable()
export class ClientController extends AbstractController<IViewClient>
  implements IClientController {
  constructor(@inject(Models.Client) private Client: ClientModel) {
    super(Client);
  }

  getAllByName(
    name: string,
    options?: QueryOptions | undefined
  ): Promise<CrudResult<IViewClient[]>> {
    throw new Error("Method not implemented.");
  }
  getById(id: string): Promise<CrudResult<IViewClient>> {
    throw new Error("Method not implemented.");
  }
  getAll(
    options?: QueryOptions | undefined
  ): Promise<CrudResult<IViewClient[]>> {
    throw new Error("Method not implemented.");
  }
  count(): Promise<CrudResult<number>> {
    throw new Error("Method not implemented.");
  }
  validate(document: IViewClient): Promise<CrudResult<Error.ValidationError>> {
    throw new Error("Method not implemented.");
  }
  save(
    document: IViewClient
  ): Promise<CrudResult<IViewClient | Error.ValidationError>> {
    throw new Error("Method not implemented.");
  }
  deleteById(id: string): Promise<CrudResult<any>> {
    throw new Error("Method not implemented.");
  }
}
