import { injectable, inject } from "inversify";
import { Error } from "mongoose";

import { AbstractController } from "../abstract";
import {
  CrudResult,
  QueryOptions,
  IProjectController
} from "../../interfaces/controllers";
import { ProjectModel, ProjectDocument } from "../../interfaces/models";
import Models from "../../constants/symbols/models";

@injectable()
export class ProjectController extends AbstractController<ProjectDocument>
  implements IProjectController {
  constructor(@inject(Models.Project) private Project: ProjectModel) {
    super(Project);
  }

  getAllByCode(
    code: string,
    options?: QueryOptions | undefined
  ): CrudResult<ProjectDocument<string>[]> {
    throw new Error("Method not implemented.");
  }
  getById(id: string): CrudResult<ProjectDocument<string>> {
    throw new Error("Method not implemented.");
  }
  getAll(
    options?: QueryOptions | undefined
  ): CrudResult<ProjectDocument<string>[]> {
    throw new Error("Method not implemented.");
  }
  count(): CrudResult<number> {
    throw new Error("Method not implemented.");
  }
  validate(
    document: ProjectDocument<string>
  ): CrudResult<Error.ValidationError> {
    throw new Error("Method not implemented.");
  }
  save(
    document: ProjectDocument<string>
  ): CrudResult<ProjectDocument<string> | Error.ValidationError> {
    throw new Error("Method not implemented.");
  }
  deleteById(id: string): CrudResult<any> {
    throw new Error("Method not implemented.");
  }
}
