import { injectable, inject } from "inversify";
import { Error } from "mongoose";

import { AbstractController } from "../abstract";
import {
  IActivityController,
  CrudResult,
  QueryOptions
} from "../../interfaces/controllers";
import { ActivityModel, ActivityDocument } from "../../interfaces/models";
import Models from "../../constants/symbols/models";

@injectable()
export class ActivityController extends AbstractController<ActivityDocument>
  implements IActivityController {
  constructor(@inject(Models.Activity) private Activity: ActivityModel) {
    super(Activity);
  }

  getById(id: string): CrudResult<ActivityDocument> {
    throw new Error("Method not implemented.");
  }

  getAll(options?: QueryOptions): CrudResult<ActivityDocument[]> {
    throw new Error("Method not implemented.");
  }

  count(): CrudResult<number> {
    throw new Error("Method not implemented.");
  }

  validate(document: ActivityDocument): CrudResult<Error.ValidationError> {
    throw new Error("Method not implemented.");
  }

  save(
    document: ActivityDocument
  ): CrudResult<ActivityDocument | Error.ValidationError> {
    throw new Error("Method not implemented.");
  }

  deleteById(id: string): CrudResult {
    throw new Error("Method not implemented.");
  }
}
