import { injectable, inject } from "inversify";
import { Error } from "mongoose";

import { AbstractController } from "../abstract";
import {
  CrudResult,
  QueryOptions,
  IPhaseController
} from "../../interfaces/controllers";
import {
  PhaseModel,
  PhaseDocument,
  ActivityDocument
} from "../../interfaces/models";
import Models from "../../constants/symbols/models";

@injectable()
export class PhaseController extends AbstractController<PhaseDocument>
  implements IPhaseController {
  constructor(@inject(Models.Phase) private Phase: PhaseModel) {
    super(Phase);
  }

  getAllPopulated(
    options?: QueryOptions | undefined
  ): CrudResult<PhaseDocument<ActivityDocument>[]> {
    throw new Error("Method not implemented.");
  }
  getById(id: string): CrudResult<PhaseDocument<string>> {
    throw new Error("Method not implemented.");
  }
  getAll(
    options?: QueryOptions | undefined
  ): CrudResult<PhaseDocument<string>[]> {
    throw new Error("Method not implemented.");
  }
  count(): CrudResult<number> {
    throw new Error("Method not implemented.");
  }
  validate(document: PhaseDocument<string>): CrudResult<Error.ValidationError> {
    throw new Error("Method not implemented.");
  }
  save(
    document: PhaseDocument<string>
  ): CrudResult<PhaseDocument<string> | Error.ValidationError> {
    throw new Error("Method not implemented.");
  }
  deleteById(id: string): CrudResult<any> {
    throw new Error("Method not implemented.");
  }
}
