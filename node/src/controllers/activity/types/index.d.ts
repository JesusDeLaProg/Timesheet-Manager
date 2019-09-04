import { IViewActivity } from "../../../../types/viewmodels";
import { IActivityController } from "../../interfaces/controllers";
import { ActivityModel } from "../../interfaces/models";
import { AbstractController } from "../abstract";
export declare class ActivityController extends AbstractController<IViewActivity> implements IActivityController {
    private Activity;
    constructor(Activity: ActivityModel);
}
//# sourceMappingURL=index.d.ts.map