import mongoose from "mongoose";
import DBClient from "../../db/mongo";

describe("MongoDB Connection", () => {
  it("should connect to MongoDB", async () => {
    await DBClient.connect();
    expect(mongoose.connection.readyState).toBe(1); // 1 represents connected state
  });
});
