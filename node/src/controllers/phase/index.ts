import { inject, injectable } from "inversify";

import { ICrudResult, IViewPhase } from "../../../../types/viewmodels";
import Models from "../../constants/symbols/models";
import { CrudResult } from "../../infrastructure/utils/crud-result";
import { IPhaseController, QueryOptions } from "../../interfaces/controllers";
import {
  ActivityDocument,
  PhaseDocument,
  PhaseModel
} from "../../interfaces/models";
import { AbstractController } from "../abstract";

@injectable()
export class PhaseController extends AbstractController<IViewPhase>
  implements IPhaseController {
  constructor(@inject(Models.Phase) private Phase: PhaseModel) {
    super(Phase);
  }

  public async getAllPopulated(
    options?: QueryOptions | undefined
  ): Promise<ICrudResult<Array<IViewPhase<ActivityDocument>>>> {
    let query = this.Phase.find();
    query = this.applyQueryOptions(query, options);
    query = query.populate("activities");
    const result = ((await query) as unknown) as Array<
      PhaseDocument<ActivityDocument>
    >;
    return CrudResult.Success(result);
  }
}
