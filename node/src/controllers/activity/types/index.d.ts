import { Error } from "mongoose";
import { AbstractController } from "../abstract";
import { IActivityController, CrudResult, QueryOptions } from "../../interfaces/controllers";
import { ActivityModel, ActivityDocument } from "../../interfaces/models";
export declare class ActivityController extends AbstractController<ActivityDocument> implements IActivityController {
    private Activity;
    constructor(Activity: ActivityModel);
    getById(id: string): CrudResult<ActivityDocument>;
    getAll(options?: QueryOptions): CrudResult<ActivityDocument[]>;
    count(): CrudResult<number>;
    validate(document: ActivityDocument): CrudResult<Error.ValidationError>;
    save(document: ActivityDocument): CrudResult<ActivityDocument | Error.ValidationError>;
    deleteById(id: string): CrudResult;
}
//# sourceMappingURL=index.d.ts.map