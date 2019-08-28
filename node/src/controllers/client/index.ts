import { inject, injectable } from "inversify";
import { Error } from "mongoose";

import { CrudResult, IViewClient } from "../../../../types/viewmodels";
import Models from "../../constants/symbols/models";
import { IClientController, QueryOptions } from "../../interfaces/controllers";
import { ClientModel } from "../../interfaces/models";
import { AbstractController } from "../abstract";

@injectable()
export class ClientController extends AbstractController<IViewClient>
  implements IClientController {
  constructor(@inject(Models.Client) private Client: ClientModel) {
    super(Client);
  }

  public getAllByName(
    name: string,
    options?: QueryOptions | undefined
  ): Promise<CrudResult<IViewClient[]>> {
    throw new Error("Method not implemented.");
  }
  public getById(id: string): Promise<CrudResult<IViewClient>> {
    throw new Error("Method not implemented.");
  }
  public getAll(
    options?: QueryOptions | undefined
  ): Promise<CrudResult<IViewClient[]>> {
    throw new Error("Method not implemented.");
  }
  public count(): Promise<CrudResult<number>> {
    throw new Error("Method not implemented.");
  }
  public validate(
    document: IViewClient
  ): Promise<CrudResult<Error.ValidationError>> {
    throw new Error("Method not implemented.");
  }
  public save(
    document: IViewClient
  ): Promise<CrudResult<IViewClient | Error.ValidationError>> {
    throw new Error("Method not implemented.");
  }
  public deleteById(id: string): Promise<CrudResult<any>> {
    throw new Error("Method not implemented.");
  }
}
