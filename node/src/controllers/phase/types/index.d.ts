import { Error } from "mongoose";
import { CrudResult, IViewPhase } from "../../../../types/viewmodels";
import { IPhaseController, QueryOptions } from "../../interfaces/controllers";
import { ActivityDocument, PhaseModel } from "../../interfaces/models";
import { AbstractController } from "../abstract";
export declare class PhaseController extends AbstractController<IViewPhase> implements IPhaseController {
    private Phase;
    constructor(Phase: PhaseModel);
    getAllPopulated(options?: QueryOptions | undefined): Promise<CrudResult<Array<IViewPhase<ActivityDocument>>>>;
    getById(id: string): Promise<CrudResult<IViewPhase<string>>>;
    getAll(options?: QueryOptions | undefined): Promise<CrudResult<Array<IViewPhase<string>>>>;
    count(): Promise<CrudResult<number>>;
    validate(document: IViewPhase<string>): Promise<CrudResult<Error.ValidationError>>;
    save(document: IViewPhase<string>): Promise<CrudResult<IViewPhase<string> | Error.ValidationError>>;
    deleteById(id: string): Promise<CrudResult<any>>;
}
//# sourceMappingURL=index.d.ts.map