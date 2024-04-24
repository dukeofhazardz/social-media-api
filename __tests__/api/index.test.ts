import request from "supertest";
import app from "../../api";

describe("API Index", () => {
  it("should return 200 status for GET /", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
  });

  it("should return 404 status for non-existing route", async () => {
    const response = await request(app).get("/non-existing-route");
    expect(response.status).toBe(404);
  });

  describe("Routes", () => {
    it("should return 200 status for GET /feeds", async () => {
      const response = await request(app).get("/feeds");
      expect(response.status).toBe(302);
    });
  
    it("should return 302 status for POST /login without credentials", async () => {
      const response = await request(app).post("/login");
      expect(response.status).toBe(302);
    });
    });
});
