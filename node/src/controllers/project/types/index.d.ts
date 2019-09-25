import { ICrudResult, IViewProject } from "../../../../types/viewmodels";
import { IProjectController, QueryOptions } from "../../interfaces/controllers";
import { ProjectModel } from "../../interfaces/models";
import { AbstractController } from "../abstract";
export declare class ProjectController extends AbstractController<IViewProject> implements IProjectController {
    private Project;
    constructor(Project: ProjectModel);
    getAllByCode(code: string, options?: QueryOptions | undefined): Promise<ICrudResult<Array<IViewProject<string>>>>;
}
//# sourceMappingURL=index.d.ts.map