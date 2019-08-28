import { inject, injectable } from "inversify";
import { Error } from "mongoose";

import { CrudResult, IViewActivity } from "../../../../types/viewmodels";
import Models from "../../constants/symbols/models";
import {
  IActivityController,
  QueryOptions
} from "../../interfaces/controllers";
import { ActivityModel } from "../../interfaces/models";
import { AbstractController } from "../abstract";

@injectable()
export class ActivityController extends AbstractController<IViewActivity>
  implements IActivityController {
  constructor(@inject(Models.Activity) private Activity: ActivityModel) {
    super(Activity);
  }

  public getById(id: string): Promise<CrudResult<IViewActivity>> {
    throw new Error("Method not implemented.");
  }

  public getAll(options?: QueryOptions): Promise<CrudResult<IViewActivity[]>> {
    throw new Error("Method not implemented.");
  }

  public count(): Promise<CrudResult<number>> {
    throw new Error("Method not implemented.");
  }

  public validate(
    document: IViewActivity
  ): Promise<CrudResult<Error.ValidationError>> {
    throw new Error("Method not implemented.");
  }

  public save(
    document: IViewActivity
  ): Promise<CrudResult<IViewActivity | Error.ValidationError>> {
    throw new Error("Method not implemented.");
  }

  public deleteById(id: string): Promise<CrudResult> {
    throw new Error("Method not implemented.");
  }
}
