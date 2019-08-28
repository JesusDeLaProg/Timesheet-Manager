import { Error } from "mongoose";
import { CrudResult, IViewClient } from "../../../../types/viewmodels";
import { IClientController, QueryOptions } from "../../interfaces/controllers";
import { ClientModel } from "../../interfaces/models";
import { AbstractController } from "../abstract";
export declare class ClientController extends AbstractController<IViewClient> implements IClientController {
    private Client;
    constructor(Client: ClientModel);
    getAllByName(name: string, options?: QueryOptions | undefined): Promise<CrudResult<IViewClient[]>>;
    getById(id: string): Promise<CrudResult<IViewClient>>;
    getAll(options?: QueryOptions | undefined): Promise<CrudResult<IViewClient[]>>;
    count(): Promise<CrudResult<number>>;
    validate(document: IViewClient): Promise<CrudResult<Error.ValidationError>>;
    save(document: IViewClient): Promise<CrudResult<IViewClient | Error.ValidationError>>;
    deleteById(id: string): Promise<CrudResult<any>>;
}
//# sourceMappingURL=index.d.ts.map