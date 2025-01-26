import express from "express";
const app = express();
import mongoose from "mongoose";
import route from "./Routers/SignUpR.js";

mongoose.connect("mongodb://localhost:27017/P_User")
    .then(() => {
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use("/", route);
    })
    .catch((e) => {
        console.log(e);
    });

app.listen(2333, () => {
    console.log("Server Started ");
});


