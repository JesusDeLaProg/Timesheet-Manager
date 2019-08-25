import { Error } from "mongoose";
import { AbstractController } from "../abstract";
import { QueryOptions, ITimesheetController } from "../../interfaces/controllers";
import { TimesheetModel, ProjectDocument } from "../../interfaces/models";
import { ITimesheetLine, StringId } from "../../../../types/datamodels";
import { IViewTimesheet, CrudResult } from "../../../../types/viewmodels";
export declare class TimesheetController extends AbstractController<IViewTimesheet> implements ITimesheetController {
    private Timesheet;
    constructor(Timesheet: TimesheetModel);
    getAllByUserId(userId: string, options?: QueryOptions | undefined): Promise<CrudResult<IViewTimesheet[]>>;
    getByIdPopulated(id: string): Promise<CrudResult<IViewTimesheet<StringId, ITimesheetLine<ProjectDocument>>[]>>;
    getById(id: string): Promise<CrudResult<IViewTimesheet>>;
    getAll(options?: QueryOptions | undefined): Promise<CrudResult<IViewTimesheet[]>>;
    count(): Promise<CrudResult<number>>;
    validate(document: IViewTimesheet): Promise<CrudResult<Error.ValidationError>>;
    save(document: IViewTimesheet): Promise<CrudResult<IViewTimesheet | Error.ValidationError>>;
    deleteById(id: string): Promise<CrudResult<any>>;
}
//# sourceMappingURL=index.d.ts.map