import { Error } from "mongoose";
import { AbstractController } from "../abstract";
import { QueryOptions, IProjectController } from "../../interfaces/controllers";
import { ProjectModel } from "../../interfaces/models";
import { IViewProject, CrudResult } from "../../../../types/viewmodels";
export declare class ProjectController extends AbstractController<IViewProject> implements IProjectController {
    private Project;
    constructor(Project: ProjectModel);
    getAllByCode(code: string, options?: QueryOptions | undefined): Promise<CrudResult<IViewProject<string>[]>>;
    getById(id: string): Promise<CrudResult<IViewProject<string>>>;
    getAll(options?: QueryOptions | undefined): Promise<CrudResult<IViewProject<string>[]>>;
    count(): Promise<CrudResult<number>>;
    validate(document: IViewProject<string>): Promise<CrudResult<Error.ValidationError>>;
    save(document: IViewProject<string>): Promise<CrudResult<IViewProject<string> | Error.ValidationError>>;
    deleteById(id: string): Promise<CrudResult<any>>;
}
//# sourceMappingURL=index.d.ts.map