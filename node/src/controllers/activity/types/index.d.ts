import { Error } from "mongoose";
import { CrudResult, IViewActivity } from "../../../../types/viewmodels";
import { IActivityController, QueryOptions } from "../../interfaces/controllers";
import { ActivityModel } from "../../interfaces/models";
import { AbstractController } from "../abstract";
export declare class ActivityController extends AbstractController<IViewActivity> implements IActivityController {
    private Activity;
    constructor(Activity: ActivityModel);
    getById(id: string): Promise<CrudResult<IViewActivity>>;
    getAll(options?: QueryOptions): Promise<CrudResult<IViewActivity[]>>;
    count(): Promise<CrudResult<number>>;
    validate(document: IViewActivity): Promise<CrudResult<Error.ValidationError>>;
    save(document: IViewActivity): Promise<CrudResult<IViewActivity | Error.ValidationError>>;
    deleteById(id: string): Promise<CrudResult>;
}
//# sourceMappingURL=index.d.ts.map