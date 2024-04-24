import { Request, Response } from "express";
import { validateEmail, validatePassword } from "../validator/validator";
import User from "../schema/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const Login = {
    async getLogin(req: Request, res: Response) {
        return res.render("login", { errors: req.flash('error'), messages: req.flash('message') });
    },

    async postLogin(req: Request, res: Response) {
        const { email, password } = req.body;
        const isValidEmail = validateEmail(email, req);
        const isValidPassword = validatePassword(password, req);

        if (!isValidEmail || !isValidPassword) {
            return res.status(422).redirect('/login');
        }

        // Attempt to find user in the database
        const user = await User.findOne({ email: email }).exec();
        if (!user) {
            req.flash("error", "User does not exist, please sign up!");
            return res.status(401).redirect("/signup");
        }
        if (!(await bcrypt.compare(password, user.password))) {
            req.flash("error", "Incorrect password");
            return res.status(401).redirect("/login");
        }

        // Sign in user and store token in cookie
        const token = jwt.sign({ email: user.email }, "social-api", { expiresIn: "1h" });
        res.cookie("token", token, {
            httpOnly: true,
            // secure: true,
            // maxAge: 1000000,
            // signed: true,
        });
        
        return res.status(202).redirect("/feeds");
    }
}

export default Login;