import { Request, Response } from "express";
import { CustomRequest } from "../auth/jwt";
import { JwtPayload } from "jsonwebtoken";
import User from "../schema/user.model";

const Home = {
    async getHome(req: CustomRequest, res: Response) {
        // Pass user object to home if user is authenticated
        if (!req.user) {
            return res.render("home");
        } else {
            const email = (req.user as JwtPayload).email;
            const currentUser = await User.findOne({ email: email }).exec();
            return res.render("home", { currentUser });
        }
    }

}


export default Home;