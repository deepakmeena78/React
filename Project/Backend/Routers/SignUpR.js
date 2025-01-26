import express from "express";
const router = express.Router();

import { SingUp, SignIn, deleteUser } from "../Controllers/SignUpC.js";

router.post("/signup", SingUp);
router.post("/signin", SignIn);
router.delete("/delete", deleteUser);

export default router;