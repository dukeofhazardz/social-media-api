// Validates all user form data
import { Request } from "express";
import * as emailValidator from "email-validator";
import * as passwordValidator from "password-validator";

export const validateFirstName = (firstName: string, req:Request) => {
    /**
     * Validates the user's first name according to specific criteria.
     *
     * @param {string} firstName - The user's first name to be validated.
     * @param {Request} req - The Express request object for storing flash messages.
     * @returns {boolean} - True if the first name is valid, false otherwise.
     */
    if (!firstName) {
        req.flash("error", "Please enter your first name");
        return false;
    }
    if (firstName.length < 2) {
        req.flash("error", "First name cannot be less than two characters")
        return false;
    }
    if (firstName[0] === firstName[0].toLowerCase()) {
        req.flash("error", "First name cannot start with lower case")
        return false;
    }
    return true;
}

export const validateLastName = (lastName: string, req:Request) => {
    /**
     * Validates the user's last name according to specific criteria.
     *
     * @param {string} lastName - The user's first name to be validated.
     * @param {Request} req - The Express request object for storing flash messages.
     * @returns {boolean} - True if the last name is valid, false otherwise.
     */
    if (!lastName) {
        req.flash("error", "Please enter your last name");
        return false;
    }
    if (lastName.length < 2) {
        req.flash("error", "Last name cannot be less than two characters")
        return false;
    }
    if (lastName[0] === lastName[0].toLowerCase()) {
        req.flash("error", "Last name cannot start with lower case")
        return false;
    }
    return true;
}

export const validateEmail = (email: string, req:Request) => {
    /**
     * Validates the user's email according to specific criteria.
     *
     * @param {string} email - The user's email to be validated.
     * @param {Request} req - The Express request object for storing flash messages.
     * @returns {boolean} - True if the email is valid, false otherwise.
     */
    if (!email) {
        req.flash("error", "Please enter an email address");
        return false;
    }
    if (!emailValidator.validate(email)) {
        req.flash("error", "Please enter a valid email address")
        return false;
    }
    return true;
}

export const validatePassword = (password: string, req:Request) => {
    /**
     * Validates the user's password according to specific criteria.
     *
     * @param {string} password - The user's password to be validated.
     * @param {Request} req - The Express request object for storing flash messages.
     * @returns {boolean} - True if the password is valid, false otherwise.
     */
    if (!password) {
        req.flash("error", "Please enter a password");
        return false;
    }
    const schema = new passwordValidator.default()
    schema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits(2)                                // Must have at least 2 digits
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']);
    const failed = schema.validate(password, { details: true }) as any[];
    if (failed.length > 0 && failed[0].message) {
        req.flash('error', (failed[0].message).replace("string", "password"))
        return false;
    }
    return true;
}

export const validatePhoneNo = (phoneNo: string, req:Request) => {
    /**
     * Validates the user's phone number according to specific criteria.
     *
     * @param {string} phoneNo - The user's phone number to be validated.
     * @param {Request} req - The Express request object for storing flash messages.
     * @returns {boolean} - True if the phone number is valid, false otherwise.
     */
    if (!phoneNo) {
        req.flash("error", "Please enter a phone number.");
        return false;
    }
    const phoneRegex = /^\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
    if (!phoneRegex.test(phoneNo)) {
        req.flash("error", "Please enter a valid phone number (e.g. +2349054675432)");
        return false;
    }
    return true;
}


export const validateAddress = (address: string, req:Request) => {
    /**
     * Validates the user's address according to specific criteria.
     *
     * @param {string} address - The user's address to be validated.
     * @param {Request} req - The Express request object for storing flash messages.
     * @returns {boolean} - True if the address is valid, false otherwise.
     */
    if (!address) {
        req.flash("error", "Please enter an address.");
        return false;
    }
    const addressRegex = /^[a-zA-Z\s]+,\s[a-zA-Z\s]+$/;
    if (!addressRegex.test(address)) {
        req.flash("error", "Please enter a valid address format (e.g., City, Country)");
        return false;
    }
    return true;
}
