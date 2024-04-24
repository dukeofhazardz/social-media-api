import { handleTokenExpiration } from "../../auth/jwt";
import { Response, Request } from "express";


describe("handleTokenExpiration Middleware", () => {
    it("should redirect to login page if TokenExpiredError is encountered", () => {
      const err = { name: "TokenExpiredError" };
      const req = {} as Request;
      const res = { redirect: jest.fn() } as unknown as Response;
      const next = jest.fn();
      handleTokenExpiration(err, req, res, next);
      expect(res.redirect).toHaveBeenCalledWith("/login");
    });
  
    it("should call next() for other types of errors", () => {
      const err = new Error("Some other error");
      const req = {} as Request;
      const res = {} as Response;
      const next = jest.fn();
      handleTokenExpiration(err, req, res, next);
      expect(next).toHaveBeenCalled();
    });
  
  });
