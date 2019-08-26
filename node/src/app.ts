import "./infrastructure/database/mongoose";
import { createExpressApp } from "./create-app";

export const app = createExpressApp();
