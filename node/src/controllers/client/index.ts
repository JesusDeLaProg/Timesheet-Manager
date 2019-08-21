import { injectable, inject } from "inversify";
import { Error } from "mongoose";

import { AbstractController } from "../abstract";
import {
  CrudResult,
  IClientController,
  QueryOptions
} from "../../interfaces/controllers";
import { ClientModel, ClientDocument } from "../../interfaces/models";
import Models from "../../constants/symbols/models";

@injectable()
export class ClientController extends AbstractController<ClientDocument>
  implements IClientController {
  constructor(@inject(Models.Client) private Client: ClientModel) {
    super(Client);
  }

  getAllByName(
    name: string,
    options?: QueryOptions | undefined
  ): CrudResult<ClientDocument[]> {
    throw new Error("Method not implemented.");
  }
  getById(id: string): CrudResult<ClientDocument> {
    throw new Error("Method not implemented.");
  }
  getAll(options?: QueryOptions | undefined): CrudResult<ClientDocument[]> {
    throw new Error("Method not implemented.");
  }
  count(): CrudResult<number> {
    throw new Error("Method not implemented.");
  }
  validate(document: ClientDocument): CrudResult<Error.ValidationError> {
    throw new Error("Method not implemented.");
  }
  save(
    document: ClientDocument
  ): CrudResult<ClientDocument | Error.ValidationError> {
    throw new Error("Method not implemented.");
  }
  deleteById(id: string): CrudResult<any> {
    throw new Error("Method not implemented.");
  }
}
