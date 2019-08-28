import { Error } from "mongoose";
import { CrudResult, IViewProject } from "../../../../types/viewmodels";
import { IProjectController, QueryOptions } from "../../interfaces/controllers";
import { ProjectModel } from "../../interfaces/models";
import { AbstractController } from "../abstract";
export declare class ProjectController extends AbstractController<IViewProject> implements IProjectController {
    private Project;
    constructor(Project: ProjectModel);
    getAllByCode(code: string, options?: QueryOptions | undefined): Promise<CrudResult<Array<IViewProject<string>>>>;
    getById(id: string): Promise<CrudResult<IViewProject<string>>>;
    getAll(options?: QueryOptions | undefined): Promise<CrudResult<Array<IViewProject<string>>>>;
    count(): Promise<CrudResult<number>>;
    validate(document: IViewProject<string>): Promise<CrudResult<Error.ValidationError>>;
    save(document: IViewProject<string>): Promise<CrudResult<IViewProject<string> | Error.ValidationError>>;
    deleteById(id: string): Promise<CrudResult<any>>;
}
//# sourceMappingURL=index.d.ts.map