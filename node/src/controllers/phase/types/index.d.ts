import { Error } from "mongoose";
import { AbstractController } from "../abstract";
import { CrudResult, QueryOptions, IPhaseController } from "../../interfaces/controllers";
import { PhaseModel, PhaseDocument, ActivityDocument } from "../../interfaces/models";
export declare class PhaseController extends AbstractController<PhaseDocument> implements IPhaseController {
    private Phase;
    constructor(Phase: PhaseModel);
    getAllPopulated(options?: QueryOptions | undefined): CrudResult<PhaseDocument<ActivityDocument>[]>;
    getById(id: string): CrudResult<PhaseDocument<string>>;
    getAll(options?: QueryOptions | undefined): CrudResult<PhaseDocument<string>[]>;
    count(): CrudResult<number>;
    validate(document: PhaseDocument<string>): CrudResult<Error.ValidationError>;
    save(document: PhaseDocument<string>): CrudResult<PhaseDocument<string> | Error.ValidationError>;
    deleteById(id: string): CrudResult<any>;
}
//# sourceMappingURL=index.d.ts.map