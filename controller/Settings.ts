import { CustomRequest } from "../auth/jwt";
import { Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import User from "../schema/user.model";


const Settings = {
    async getSettings(req: CustomRequest, res: Response) {
        try {
            // Get current user
            const email = (req.user as JwtPayload).email;
            const currentUser = await User.findOne({ email: email }).exec();

            return res.render("settings", { currentUser });
        } catch(error) {
            req.flash("error", "Error getting settings")
            return res.status(403).redirect("/login");
        }
    },

    async postSettings(req: CustomRequest, res: Response) {
        try {
            const email = (req.user as JwtPayload).email;

            // Get image name
            let imageFile = '';
            if (req.file) {
                imageFile = req.file.filename;
            }

            // Find user and update the database with user's profile image
            const user = await User.findOne({ email: email }).exec();
            await User.updateOne({ _id: user._id }, { $set: { profilePicture: imageFile} }).exec();
            req.flash("message", "Profile picture updated successfully");
            return res.status(201).redirect("/profile");
        } catch(error) {
            req.flash("error", "Error uploading profile picture");
            return res.status(500).redirect("/profile");
        }
    }

}


export default Settings;