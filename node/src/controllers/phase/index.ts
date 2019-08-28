import { inject, injectable } from "inversify";
import { Error } from "mongoose";

import { CrudResult, IViewPhase } from "../../../../types/viewmodels";
import Models from "../../constants/symbols/models";
import { IPhaseController, QueryOptions } from "../../interfaces/controllers";
import { ActivityDocument, PhaseModel } from "../../interfaces/models";
import { AbstractController } from "../abstract";

@injectable()
export class PhaseController extends AbstractController<IViewPhase>
  implements IPhaseController {
  constructor(@inject(Models.Phase) private Phase: PhaseModel) {
    super(Phase);
  }

  public getAllPopulated(
    options?: QueryOptions | undefined
  ): Promise<CrudResult<Array<IViewPhase<ActivityDocument>>>> {
    throw new Error("Method not implemented.");
  }
  public getById(id: string): Promise<CrudResult<IViewPhase<string>>> {
    throw new Error("Method not implemented.");
  }
  public getAll(
    options?: QueryOptions | undefined
  ): Promise<CrudResult<Array<IViewPhase<string>>>> {
    throw new Error("Method not implemented.");
  }
  public count(): Promise<CrudResult<number>> {
    throw new Error("Method not implemented.");
  }
  public validate(
    document: IViewPhase<string>
  ): Promise<CrudResult<Error.ValidationError>> {
    throw new Error("Method not implemented.");
  }
  public save(
    document: IViewPhase<string>
  ): Promise<CrudResult<IViewPhase<string> | Error.ValidationError>> {
    throw new Error("Method not implemented.");
  }
  public deleteById(id: string): Promise<CrudResult<any>> {
    throw new Error("Method not implemented.");
  }
}
