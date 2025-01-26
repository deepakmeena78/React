import User from "../Models/SignUpM.js";
import bcypt from "bcrypt";
import jwt from "jsonwebtoken";

export const SingUp = async (req, res) => {
    const { name, email, password } = req.body;
    console.log(req.body);
    try {
        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(400).json({ msg: "User Already Exist" });
        }
        const hashPassword = await bcypt.hash(password, 10);
        const createUser = new User({ name, email, password: hashPassword });
        await createUser.save();
        return res.status(200).json({ msg: "Sign Up Successfully" });
    } catch (err) {
        console.log("SIGN-IN", err);
        return res.status(500).json({ msg: "Post Data Some Issue" })
    }
}

export const SignIn = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    try {
        const checkUser = await User.findOne({ email });
        if (!checkUser) {
            return res.status(401).json({ msg: "User Not Found" });
        }
        const ismatch = await bcypt.compare(password, checkUser.password);
        if (ismatch) {
            const token = await jwt.sign({ id: checkUser._id }, "Your Secret Key", {
                expiresIn: "1h",
            });
            return res.status(200).json({ msg: "User successfully signed in", token });
        } else {
            return res.status(400).json({ msg: "Incorrect password" });
        }
    } catch (er) {
        return res.status(400).json({ msg: "Incorrect password" });
    }
}

export const deleteUser = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    try {
        const check = await User.findOne({ email });
        console.log(check);
        if (!check) {
            return res.status(400).json("Not User");
        }
        await User.deleteOne();
        return res.status(200).json({ msg: "Delete SuccessFull" });
    } catch (error) {
        return res.status(200).json({ msg: "Issue" });
    }
}