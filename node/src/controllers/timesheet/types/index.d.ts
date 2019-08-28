import { Error } from "mongoose";
import { ITimesheetLine, StringId } from "../../../../types/datamodels";
import { CrudResult, IViewTimesheet } from "../../../../types/viewmodels";
import { ITimesheetController, QueryOptions } from "../../interfaces/controllers";
import { ProjectDocument, TimesheetModel } from "../../interfaces/models";
import { AbstractController } from "../abstract";
export declare class TimesheetController extends AbstractController<IViewTimesheet> implements ITimesheetController {
    private Timesheet;
    constructor(Timesheet: TimesheetModel);
    getAllByUserId(userId: string, options?: QueryOptions | undefined): Promise<CrudResult<IViewTimesheet[]>>;
    getByIdPopulated(id: string): Promise<CrudResult<Array<IViewTimesheet<StringId, ITimesheetLine<ProjectDocument>>>>>;
    getById(id: string): Promise<CrudResult<IViewTimesheet>>;
    getAll(options?: QueryOptions | undefined): Promise<CrudResult<IViewTimesheet[]>>;
    count(): Promise<CrudResult<number>>;
    validate(document: IViewTimesheet): Promise<CrudResult<Error.ValidationError>>;
    save(document: IViewTimesheet): Promise<CrudResult<IViewTimesheet | Error.ValidationError>>;
    deleteById(id: string): Promise<CrudResult<any>>;
}
//# sourceMappingURL=index.d.ts.map