import { NextFunction, Request, Response } from "express";
import { UserRole } from "../../constants/enums/user-role";
interface IAuthorizeOptions {
    allow?: UserRole[];
    block?: UserRole[];
}
export default function authorize(options: IAuthorizeOptions): (req: Request, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=authorize.d.ts.map