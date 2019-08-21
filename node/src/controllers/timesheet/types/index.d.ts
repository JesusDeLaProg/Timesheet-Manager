import { Error } from "mongoose";
import { AbstractController } from "../abstract";
import { CrudResult, QueryOptions, ITimesheetController } from "../../interfaces/controllers";
import { TimesheetModel, TimesheetDocument, ProjectDocument } from "../../interfaces/models";
import { ITimesheetLine, StringId } from "../../../../types/datamodels";
export declare class TimesheetController extends AbstractController<TimesheetDocument> implements ITimesheetController {
    private Timesheet;
    constructor(Timesheet: TimesheetModel);
    getAllByUserId(userId: string, options?: QueryOptions | undefined): CrudResult<TimesheetDocument[]>;
    getByIdPopulated(id: string): CrudResult<TimesheetDocument<StringId, ITimesheetLine<ProjectDocument>>[]>;
    getById(id: string): CrudResult<TimesheetDocument>;
    getAll(options?: QueryOptions | undefined): CrudResult<TimesheetDocument[]>;
    count(): CrudResult<number>;
    validate(document: TimesheetDocument): CrudResult<Error.ValidationError>;
    save(document: TimesheetDocument): CrudResult<TimesheetDocument | Error.ValidationError>;
    deleteById(id: string): CrudResult<any>;
}
//# sourceMappingURL=index.d.ts.map