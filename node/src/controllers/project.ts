import { inject, injectable } from "inversify";
import escapeRegExp from "lodash.escaperegexp";

import { ICrudResult, IViewProject } from "../../../types/viewmodels";
import Models from "../constants/symbols/models";
import { CrudResult } from "../infrastructure/utils/crud-result";
import { IProjectController, QueryOptions } from "../interfaces/controllers";
import { ProjectModel } from "../interfaces/models";
import { AbstractController } from "./abstract";

@injectable()
export class ProjectController extends AbstractController<IViewProject>
  implements IProjectController {
  constructor(@inject(Models.Project) private Project: ProjectModel) {
    super(Project);
  }

  public async getAllByCode(
    code: string,
    options?: QueryOptions | undefined
  ): Promise<ICrudResult<Array<IViewProject<string>>>> {
    let query = this.Project.find({
      code: new RegExp(escapeRegExp(code), "i"),
      isActive: true
    });
    query = this.applyQueryOptions(query, options);
    const result = await query;
    return CrudResult.Success(result);
  }
}
