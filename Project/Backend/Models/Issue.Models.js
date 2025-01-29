import mongoose from "mongoose";

 const IssueModel = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    location: {
        type: String,
        require: true
    },
    date: {
        type: String,
        require: true
    },
    time: {
        type: String,
        require: true,
        default: () => new Date().toLocaleTimeString()
    },
    issue: {
        type: String,
        require: true
    },
    desc: {
        type: String,
        require: true
    },
    image:{
        type: String,
        require: true
    }
 });

 const User = mongoose.model("Issue_Create",IssueModel);
 export default User;