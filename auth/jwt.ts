import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Define a CustomRequest Interface for user authentication
export interface CustomRequest extends Request {
    user?: JwtPayload | undefined | string;
}

// Middleware function to check the token
export const checkToken = (req: CustomRequest, res: Response, next: NextFunction) => {
    // Get the token from the cookies or headers or wherever you store it
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        // If token is not provided, user is not authenticated
        return next();
    }

    try {
        // Verify the token
        const decoded: JwtPayload | string = jwt.verify(token, "social-api");
        req.user = decoded; // Attach the decoded user information to the request object
        next();
    } catch (error) {
        // If token is invalid, return forbidden error
        return res.status(403).redirect("/login");
    }
};

// Middleware function to verify the token
export const verifyToken = (req: CustomRequest, res: Response, next: NextFunction) => {
    // Get the token from the cookies
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        // If token is not provided, return unauthorized error
        return res.status(401).redirect("/login");
    }

    // Verify the token
    const decoded: JwtPayload | string | undefined = jwt.verify(token, "social-api");
    if (!decoded) {
        // If token is invalid, return forbidden error
        return res.status(403).redirect("/");
    } else {
        // If token is valid, attach the decoded user information to the request object
        req.user = decoded;
        next();
    }
};

// Define middleware to handle JWT token expiration errors
export const handleTokenExpiration = (err: any, req: Request, res: Response, next: NextFunction) => {
    // Check if the error is a TokenExpiredError
    if (err.name === "TokenExpiredError") {
        // Redirect the user to the login page
        return res.redirect("/login");
    }
    // If it's not a TokenExpiredError, proceed to the next middleware
    next();
};