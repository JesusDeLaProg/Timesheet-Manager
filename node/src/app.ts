import cookieParser from "cookie-parser";
import express from "express";
import logger from "morgan";
import path from "path";

import { message } from "./routes/user";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.get("/api", (req, res, next) => res.end("Hello!"));
app.get("/api/user", (req, res, next) => res.end(message));
app.use(express.static(path.join(__dirname, "public")));

module.exports = app;
