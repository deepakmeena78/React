import express from "express";
const app = express();
import mongoose from "mongoose";
import route1 from "./Routers/SignUpRouter.js";
import route2 from "./Routers/Issue.Route.js";

mongoose.connect("mongodb://localhost:27017/My_Project")
    .then(() => {
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
          app.use("/new", route1);
        app.use("/", route2);
    })
    .catch((e) => {
        console.log(e);
    });

app.listen(2333, () => {
    console.log("Server Started ");
});
