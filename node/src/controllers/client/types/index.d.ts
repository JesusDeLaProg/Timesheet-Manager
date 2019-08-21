import { Error } from "mongoose";
import { AbstractController } from "../abstract";
import { CrudResult, IClientController, QueryOptions } from "../../interfaces/controllers";
import { ClientModel, ClientDocument } from "../../interfaces/models";
export declare class ClientController extends AbstractController<ClientDocument> implements IClientController {
    private Client;
    constructor(Client: ClientModel);
    getAllByName(name: string, options?: QueryOptions | undefined): CrudResult<ClientDocument[]>;
    getById(id: string): CrudResult<ClientDocument>;
    getAll(options?: QueryOptions | undefined): CrudResult<ClientDocument[]>;
    count(): CrudResult<number>;
    validate(document: ClientDocument): CrudResult<Error.ValidationError>;
    save(document: ClientDocument): CrudResult<ClientDocument | Error.ValidationError>;
    deleteById(id: string): CrudResult<any>;
}
//# sourceMappingURL=index.d.ts.map