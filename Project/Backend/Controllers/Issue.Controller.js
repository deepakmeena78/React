import fs from "fs";
import IssuData from "../Models/Issue.Models.js";

export const Issue = async (req, res) => {
    try {
        const { name, location, date, time, issue, desc } = req.body;

        const imagePath = req.file.path;
        const image = fs.readFileSync(imagePath, { encoding: "base64" });

        const CreateNew = new IssuData({ name, location, date, time, issue, desc, image });
        await CreateNew.save();
        return res.status(200).json({ msg: "SuccessFully Data Insert" });
    } catch (error) {
        console.log("ERR", error);
        return res.status(500).json({ msg: "Error A Gai Hai" });
    }
}

export const Solve = async (req, res) => {
    try {
        const location = req.body;
        const getData = await IssuData.findOne(location);
        if (!getData) {
            return res.status(400).json({ msg: "User Not" });
        }
        const Data = await IssuData.find({});
        const OriginalImage = Data[0].image;
        const imagee = Buffer.from(OriginalImage, "base64");
        console.log(imagee);
        return res.status(200).json({ msg: "Data Get Successfuly" });
    } catch (error) {
        return res.status(500).json({ msg: "Error Good Yaar" });
    }
}

