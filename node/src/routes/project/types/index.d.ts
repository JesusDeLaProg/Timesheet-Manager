import { IProjectController } from "../../interfaces/controllers";
import { HasRouter } from "../../interfaces/routers";
export declare class ProjectRouter implements HasRouter {
    private _projectController;
    readonly router: import("express-serve-static-core").Router;
    constructor(_projectController: IProjectController);
    private _init;
}
//# sourceMappingURL=index.d.ts.map