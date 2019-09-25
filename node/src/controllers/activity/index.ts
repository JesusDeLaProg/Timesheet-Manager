import { inject, injectable } from "inversify";
import { Error } from "mongoose";

import { ICrudResult, IViewActivity } from "../../../../types/viewmodels";
import Models from "../../constants/symbols/models";
import { IActivityController } from "../../interfaces/controllers";
import { ActivityModel } from "../../interfaces/models";
import { AbstractController } from "../abstract";

@injectable()
export class ActivityController extends AbstractController<IViewActivity>
  implements IActivityController {
  constructor(@inject(Models.Activity) private Activity: ActivityModel) {
    super(Activity);
  }
}
