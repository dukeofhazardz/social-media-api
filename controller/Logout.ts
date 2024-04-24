import { Request, Response } from "express";

const Logout = {
    async postLogout(req: Request, res: Response) {
        // Logs out a user
        res.clearCookie("token");
        return res.status(302).redirect("/");
    }
}


export default Logout;