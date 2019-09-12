import "reflect-metadata";
import { createExpressApp } from "./create-app";
import "./infrastructure/database/mongoose";
import setup from "./infrastructure/environment/setup";

const envSetupResult = setup();
export const app = createExpressApp();
