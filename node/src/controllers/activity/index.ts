import { injectable, inject } from "inversify";
import { Error } from "mongoose";

import { AbstractController } from "../abstract";
import {
  IActivityController,
  QueryOptions
} from "../../interfaces/controllers";
import { ActivityModel } from "../../interfaces/models";
import Models from "../../constants/symbols/models";
import { IViewActivity, CrudResult } from "../../../../types/viewmodels";

@injectable()
export class ActivityController extends AbstractController<IViewActivity>
  implements IActivityController {
  constructor(@inject(Models.Activity) private Activity: ActivityModel) {
    super(Activity);
  }

  getById(id: string): Promise<CrudResult<IViewActivity>> {
    throw new Error("Method not implemented.");
  }

  getAll(options?: QueryOptions): Promise<CrudResult<IViewActivity[]>> {
    throw new Error("Method not implemented.");
  }

  count(): Promise<CrudResult<number>> {
    throw new Error("Method not implemented.");
  }

  validate(
    document: IViewActivity
  ): Promise<CrudResult<Error.ValidationError>> {
    throw new Error("Method not implemented.");
  }

  save(
    document: IViewActivity
  ): Promise<CrudResult<IViewActivity | Error.ValidationError>> {
    throw new Error("Method not implemented.");
  }

  deleteById(id: string): Promise<CrudResult> {
    throw new Error("Method not implemented.");
  }
}
