import { ICrudResult, IViewPhase } from "../../../../types/viewmodels";
import { IPhaseController, QueryOptions } from "../../interfaces/controllers";
import { ActivityDocument, PhaseModel } from "../../interfaces/models";
import { AbstractController } from "../abstract";
export declare class PhaseController extends AbstractController<IViewPhase> implements IPhaseController {
    private Phase;
    constructor(Phase: PhaseModel);
    getAllPopulated(options?: QueryOptions | undefined): Promise<ICrudResult<Array<IViewPhase<ActivityDocument>>>>;
}
//# sourceMappingURL=index.d.ts.map