import { validateFirstName, validateLastName, validateEmail, validatePassword, validatePhoneNo, validateAddress } from "../../validator/validator";
import { Request } from "express";

describe("Validation Functions", () => {
  let req: Request;

  beforeEach(() => {
    req = {
      flash: jest.fn()
    } as unknown as Request;
  });

  describe("validateFirstName", () => {
    it("should return false if first name is empty", () => {
      expect(validateFirstName("", req)).toBeFalsy();
      expect(req.flash).toHaveBeenCalledWith("error", "Please enter your first name");
    });

    it("should return false if first name has less than two characters", () => {
      expect(validateFirstName("A", req)).toBeFalsy();
      expect(req.flash).toHaveBeenCalledWith("error", "First name cannot be less than two characters");
    });

    it("should return false if first name starts with a lowercase letter", () => {
      expect(validateFirstName("john", req)).toBeFalsy();
      expect(req.flash).toHaveBeenCalledWith("error", "First name cannot start with lower case");
    });

    it("should return true if first name is valid", () => {
      expect(validateFirstName("John", req)).toBeTruthy();
      expect(req.flash).not.toHaveBeenCalled();
    });
  });

  describe("validateLastName", () => {
    it("should return false if last name is empty", () => {
      expect(validateLastName("", req)).toBeFalsy();
      expect(req.flash).toHaveBeenCalledWith("error", "Please enter your last name");
    });

    it("should return false if last name has less than two characters", () => {
      expect(validateLastName("D", req)).toBeFalsy();
      expect(req.flash).toHaveBeenCalledWith("error", "Last name cannot be less than two characters");
    });

    it("should return false if last name starts with a lowercase letter", () => {
      expect(validateLastName("doe", req)).toBeFalsy();
      expect(req.flash).toHaveBeenCalledWith("error", "Last name cannot start with lower case");
    });

    it("should return true if last name is valid", () => {
      expect(validateLastName("Doe", req)).toBeTruthy();
      expect(req.flash).not.toHaveBeenCalled();
    });
  });

  // validateEmail tests
  describe("validateEmail", () => {
    it("should return false if email is empty", () => {
      expect(validateEmail("", req)).toBeFalsy();
      expect(req.flash).toHaveBeenCalledWith("error", "Please enter an email address");
    });

    it("should return false if email is invalid", () => {
      expect(validateEmail("invalid_email", req)).toBeFalsy();
      expect(req.flash).toHaveBeenCalledWith("error", "Please enter a valid email address");
    });

    it("should return true if email is valid", () => {
      expect(validateEmail("user@example.com", req)).toBeTruthy();
      expect(req.flash).not.toHaveBeenCalled();
    });
  });

  describe("validatePassword", () => {
    it("should return false if password is empty", () => {
      expect(validatePassword("", req)).toBeFalsy();
      expect(req.flash).toHaveBeenCalledWith("error", "Please enter a password");
    });
  
    it("should return false if password does not meet requirements", () => {
      expect(validatePassword("weak", req)).toBeFalsy();
      expect(req.flash).toHaveBeenCalledWith(
        "error",
        "The password should have a minimum length of 8 characters"
      );
    });
  
    it("should return true if password is valid", () => {
      expect(validatePassword("StrongP@ssw0rd145", req)).toBeTruthy();
      expect(req.flash).not.toHaveBeenCalled();
    });
  });
  
  // validatePhoneNo tests
  describe("validatePhoneNo", () => {
    it("should return false if phone number is empty", () => {
      expect(validatePhoneNo("", req)).toBeFalsy();
      expect(req.flash).toHaveBeenCalledWith("error", "Please enter a phone number.");
    });
  
    it("should return false if phone number is invalid", () => {
      expect(validatePhoneNo("123456789", req)).toBeFalsy();
      expect(req.flash).toHaveBeenCalledWith(
        "error",
        "Please enter a valid phone number (e.g. +2349054675432)"
      );
    });
  
    it("should return true if phone number is valid", () => {
      expect(validatePhoneNo("+2349054675432", req)).toBeTruthy();
      expect(req.flash).not.toHaveBeenCalled();
    });
  });
  
  // validateAddress tests
  describe("validateAddress", () => {
    it("should return false if address is empty", () => {
      expect(validateAddress("", req)).toBeFalsy();
      expect(req.flash).toHaveBeenCalledWith("error", "Please enter an address.");
    });
  
    it("should return false if address is invalid", () => {
      expect(validateAddress("Invalid Address", req)).toBeFalsy();
      expect(req.flash).toHaveBeenCalledWith(
        "error",
        "Please enter a valid address format (e.g., City, Country)"
      );
    });
  
    it("should return true if address is valid", () => {
      expect(validateAddress("Abuja, Nigeria", req)).toBeTruthy();
      expect(req.flash).not.toHaveBeenCalled();
    });
  });
});

