import express from "express";
import multer from "multer";

const upload = multer({ dest: "uploads/" });
const route = express.Router();

import { Issue, Solve } from "../Controllers/Issue.Controller.js";

route.post("/issue", upload.single("image"), Issue);
route.get("/solve", Solve);

export default route;
