import { Error } from "mongoose";
import { AbstractController } from "../abstract";
import { CrudResult, QueryOptions, IProjectController } from "../../interfaces/controllers";
import { ProjectModel, ProjectDocument } from "../../interfaces/models";
export declare class ProjectController extends AbstractController<ProjectDocument> implements IProjectController {
    private Project;
    constructor(Project: ProjectModel);
    getAllByCode(code: string, options?: QueryOptions | undefined): CrudResult<ProjectDocument<string>[]>;
    getById(id: string): CrudResult<ProjectDocument<string>>;
    getAll(options?: QueryOptions | undefined): CrudResult<ProjectDocument<string>[]>;
    count(): CrudResult<number>;
    validate(document: ProjectDocument<string>): CrudResult<Error.ValidationError>;
    save(document: ProjectDocument<string>): CrudResult<ProjectDocument<string> | Error.ValidationError>;
    deleteById(id: string): CrudResult<any>;
}
//# sourceMappingURL=index.d.ts.map