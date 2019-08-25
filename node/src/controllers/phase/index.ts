import { injectable, inject } from "inversify";
import { Error } from "mongoose";

import { AbstractController } from "../abstract";
import { QueryOptions, IPhaseController } from "../../interfaces/controllers";
import { PhaseModel, ActivityDocument } from "../../interfaces/models";
import Models from "../../constants/symbols/models";
import { IViewPhase, CrudResult } from "../../../../types/viewmodels";

@injectable()
export class PhaseController extends AbstractController<IViewPhase>
  implements IPhaseController {
  constructor(@inject(Models.Phase) private Phase: PhaseModel) {
    super(Phase);
  }

  getAllPopulated(
    options?: QueryOptions | undefined
  ): Promise<CrudResult<IViewPhase<ActivityDocument>[]>> {
    throw new Error("Method not implemented.");
  }
  getById(id: string): Promise<CrudResult<IViewPhase<string>>> {
    throw new Error("Method not implemented.");
  }
  getAll(
    options?: QueryOptions | undefined
  ): Promise<CrudResult<IViewPhase<string>[]>> {
    throw new Error("Method not implemented.");
  }
  count(): Promise<CrudResult<number>> {
    throw new Error("Method not implemented.");
  }
  validate(
    document: IViewPhase<string>
  ): Promise<CrudResult<Error.ValidationError>> {
    throw new Error("Method not implemented.");
  }
  save(
    document: IViewPhase<string>
  ): Promise<CrudResult<IViewPhase<string> | Error.ValidationError>> {
    throw new Error("Method not implemented.");
  }
  deleteById(id: string): Promise<CrudResult<any>> {
    throw new Error("Method not implemented.");
  }
}
