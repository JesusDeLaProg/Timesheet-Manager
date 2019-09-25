import { ObjectId } from "bson";
import { IUserRole } from "../../../../types/datamodels";
import { JWTPayload } from "../../interfaces/routers";
declare type DoneFunction = (err: any, result: {
    _id: ObjectId;
    role: IUserRole;
} | false) => unknown;
declare type VerifyFunction = (payload: JWTPayload, done: DoneFunction) => unknown;
export default function setup(verifyFunction: VerifyFunction): void;
export {};
//# sourceMappingURL=jwt.d.ts.map