import { Error as MongooseError } from "mongoose";
import { ITimesheetLine, StringId } from "../../../../types/datamodels";
import { ICrudResult, IViewProject, IViewTimesheet } from "../../../../types/viewmodels";
import { ITimesheetController, QueryOptions } from "../../interfaces/controllers";
import { TimesheetModel, UserModel } from "../../interfaces/models";
import { AbstractController } from "../abstract";
export declare class TimesheetController extends AbstractController<IViewTimesheet> implements ITimesheetController {
    private Timesheet;
    private User;
    constructor(Timesheet: TimesheetModel, User: UserModel);
    getAllByUserId(userId: string, options?: QueryOptions | undefined): Promise<ICrudResult<IViewTimesheet[]>>;
    getByIdPopulated(id: string): Promise<ICrudResult<IViewTimesheet<StringId, ITimesheetLine<IViewProject>>>>;
    validate(input: IViewTimesheet, authenticatedUserId?: StringId): Promise<ICrudResult<MongooseError.ValidationError>>;
    save(input: IViewTimesheet, authenticatedUserId?: StringId): Promise<ICrudResult<IViewTimesheet | MongooseError.ValidationError>>;
    private getAuthenticatedUser;
    private validatePrivileges;
    private checkUpdatePrivileges;
    private checkCreatePrivileges;
}
//# sourceMappingURL=index.d.ts.map