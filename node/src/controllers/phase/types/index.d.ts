import { Error } from "mongoose";
import { AbstractController } from "../abstract";
import { QueryOptions, IPhaseController } from "../../interfaces/controllers";
import { PhaseModel, ActivityDocument } from "../../interfaces/models";
import { IViewPhase, CrudResult } from "../../../../types/viewmodels";
export declare class PhaseController extends AbstractController<IViewPhase> implements IPhaseController {
    private Phase;
    constructor(Phase: PhaseModel);
    getAllPopulated(options?: QueryOptions | undefined): Promise<CrudResult<IViewPhase<ActivityDocument>[]>>;
    getById(id: string): Promise<CrudResult<IViewPhase<string>>>;
    getAll(options?: QueryOptions | undefined): Promise<CrudResult<IViewPhase<string>[]>>;
    count(): Promise<CrudResult<number>>;
    validate(document: IViewPhase<string>): Promise<CrudResult<Error.ValidationError>>;
    save(document: IViewPhase<string>): Promise<CrudResult<IViewPhase<string> | Error.ValidationError>>;
    deleteById(id: string): Promise<CrudResult<any>>;
}
//# sourceMappingURL=index.d.ts.map