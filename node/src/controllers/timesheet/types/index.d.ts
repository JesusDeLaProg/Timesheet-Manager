import { Error as MongooseError, Types } from "mongoose";
import { ITimesheetLine, StringId } from "../../../../types/datamodels";
import { ICrudResult, IViewProject, IViewTimesheet } from "../../../../types/viewmodels";
import { ITimesheetController, QueryOptions } from "../../interfaces/controllers";
import { TimesheetDocument, TimesheetModel, UserModel } from "../../interfaces/models";
import { AbstractController } from "../abstract";
export declare class TimesheetController extends AbstractController<IViewTimesheet> implements ITimesheetController {
    private Timesheet;
    private User;
    constructor(Timesheet: TimesheetModel, User: UserModel);
    getById(id: StringId, authenticatedUserId?: StringId | Types.ObjectId): Promise<ICrudResult<IViewTimesheet>>;
    getAllByUserId(userId: StringId, authenticatedUserId?: StringId, options?: QueryOptions | undefined): Promise<ICrudResult<IViewTimesheet[]>>;
    getByIdPopulated(id: string, authenticatedUserId?: StringId | Types.ObjectId): Promise<ICrudResult<IViewTimesheet<StringId, ITimesheetLine<IViewProject>>>>;
    countByUserId(userId: StringId, authenticatedUserId?: StringId | Types.ObjectId): Promise<ICrudResult<number>>;
    validate(input: IViewTimesheet, authenticatedUserId?: StringId): Promise<ICrudResult<MongooseError.ValidationError>>;
    save(input: IViewTimesheet, authenticatedUserId?: StringId): Promise<ICrudResult<IViewTimesheet | MongooseError.ValidationError>>;
    protected objectToDocument(input: IViewTimesheet): Promise<TimesheetDocument>;
    private _getUser;
    private _validatePrivileges;
    private _checkReadPrivileges;
    private _checkUpdatePrivileges;
    private _checkCreatePrivileges;
}
//# sourceMappingURL=index.d.ts.map