import { ICrudResult, IViewClient } from "../../../../types/viewmodels";
import { IClientController, QueryOptions } from "../../interfaces/controllers";
import { ClientModel } from "../../interfaces/models";
import { AbstractController } from "../abstract";
export declare class ClientController extends AbstractController<IViewClient> implements IClientController {
    private Client;
    constructor(Client: ClientModel);
    getAllByName(name: string, options?: QueryOptions | undefined): Promise<ICrudResult<IViewClient[]>>;
}
//# sourceMappingURL=index.d.ts.map