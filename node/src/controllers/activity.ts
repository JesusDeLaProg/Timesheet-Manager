import { inject, injectable } from "inversify";

import { IViewActivity } from "../../../types/viewmodels";
import Models from "../constants/symbols/models";
import { IActivityController } from "../interfaces/controllers";
import { ActivityModel } from "../interfaces/models";
import { AbstractController } from "./abstract";

@injectable()
export class ActivityController extends AbstractController<IViewActivity>
  implements IActivityController {
  constructor(@inject(Models.Activity) Activity: ActivityModel) {
    super(Activity);
  }
}
