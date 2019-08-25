import { injectable, inject } from "inversify";
import { Error } from "mongoose";

import { AbstractController } from "../abstract";
import { QueryOptions, IProjectController } from "../../interfaces/controllers";
import { ProjectModel } from "../../interfaces/models";
import Models from "../../constants/symbols/models";
import { IViewProject, CrudResult } from "../../../../types/viewmodels";

@injectable()
export class ProjectController extends AbstractController<IViewProject>
  implements IProjectController {
  constructor(@inject(Models.Project) private Project: ProjectModel) {
    super(Project);
  }

  getAllByCode(
    code: string,
    options?: QueryOptions | undefined
  ): Promise<CrudResult<IViewProject<string>[]>> {
    throw new Error("Method not implemented.");
  }
  getById(id: string): Promise<CrudResult<IViewProject<string>>> {
    throw new Error("Method not implemented.");
  }
  getAll(
    options?: QueryOptions | undefined
  ): Promise<CrudResult<IViewProject<string>[]>> {
    throw new Error("Method not implemented.");
  }
  count(): Promise<CrudResult<number>> {
    throw new Error("Method not implemented.");
  }
  validate(
    document: IViewProject<string>
  ): Promise<CrudResult<Error.ValidationError>> {
    throw new Error("Method not implemented.");
  }
  save(
    document: IViewProject<string>
  ): Promise<CrudResult<IViewProject<string> | Error.ValidationError>> {
    throw new Error("Method not implemented.");
  }
  deleteById(id: string): Promise<CrudResult<any>> {
    throw new Error("Method not implemented.");
  }
}
