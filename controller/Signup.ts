import { Request, Response } from "express";
import { validateAddress, validateEmail, validateFirstName, validateLastName, validatePassword, validatePhoneNo } from "../validator/validator";
import User, { IUser } from "../schema/user.model";
import bycrpt from "bcrypt";


const Signup = {
    async getSignup(req: Request, res: Response) {
        return res.render("signup", { errors: req.flash('error'), messages: req.flash('message') });
    },

    async postSignup(req: Request, res: Response) {
        // Validate form input data
        const { firstName, lastName, email, password, phoneNo, address } = req.body;
        const isValidFirstName = validateFirstName(firstName, req);
        const isValidLastName = validateLastName(lastName, req);
        const isValidEmail = validateEmail(email, req);
        const isValidPassword = validatePassword(password, req);
        const isValidPhoneNo = validatePhoneNo(phoneNo, req);
        const isValidAddress = validateAddress(address, req);

        if (!isValidFirstName || !isValidLastName || !isValidEmail || !isValidPassword || !isValidPhoneNo || !isValidAddress) {
            return res.status(422).redirect('/signup');
        }

        // Attempt to find an existing user
        const existingUser: IUser = await User.findOne({ email: email }).exec();
        if (existingUser) {
            req.flash('error', "User already exists, please log in!");
            return res.status(401).redirect('/signup');
        }

        // Creating a new user object
        const saltRounds = 10;
        const hashedPassword = await bycrpt.hash(password, saltRounds);
        const newUser = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            profilePicture: "default-image.jpg",
            password: hashedPassword,
            phoneNo: phoneNo,
            address: address,
            createdAt: Date(),
            followers: [],
            following: [],
            posts: [],
        });
        newUser.save();
        return res.status(201).redirect("/login");
    }

}


export default Signup;