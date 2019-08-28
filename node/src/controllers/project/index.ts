import { inject, injectable } from "inversify";
import { Error } from "mongoose";

import { CrudResult, IViewProject } from "../../../../types/viewmodels";
import Models from "../../constants/symbols/models";
import { IProjectController, QueryOptions } from "../../interfaces/controllers";
import { ProjectModel } from "../../interfaces/models";
import { AbstractController } from "../abstract";

@injectable()
export class ProjectController extends AbstractController<IViewProject>
  implements IProjectController {
  constructor(@inject(Models.Project) private Project: ProjectModel) {
    super(Project);
  }

  public getAllByCode(
    code: string,
    options?: QueryOptions | undefined
  ): Promise<CrudResult<Array<IViewProject<string>>>> {
    throw new Error("Method not implemented.");
  }
  public getById(id: string): Promise<CrudResult<IViewProject<string>>> {
    throw new Error("Method not implemented.");
  }
  public getAll(
    options?: QueryOptions | undefined
  ): Promise<CrudResult<Array<IViewProject<string>>>> {
    throw new Error("Method not implemented.");
  }
  public count(): Promise<CrudResult<number>> {
    throw new Error("Method not implemented.");
  }
  public validate(
    document: IViewProject<string>
  ): Promise<CrudResult<Error.ValidationError>> {
    throw new Error("Method not implemented.");
  }
  public save(
    document: IViewProject<string>
  ): Promise<CrudResult<IViewProject<string> | Error.ValidationError>> {
    throw new Error("Method not implemented.");
  }
  public deleteById(id: string): Promise<CrudResult<any>> {
    throw new Error("Method not implemented.");
  }
}
