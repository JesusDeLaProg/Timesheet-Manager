import "reflect-metadata";
import { createExpressApp } from "./create-app";
import "infrastructure/database/mongoose";

export const app = createExpressApp();
