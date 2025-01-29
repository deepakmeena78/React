import express from "express";
const router = express.Router();

import { SingUp, SignIn, UpdateUser, deleteUser } from "../Controllers/SignUp.Controller.js";

router.post("/signup", SingUp);
router.post("/signin", SignIn);
router.patch("/update", UpdateUser);
router.delete("/delete", deleteUser);

export default router;