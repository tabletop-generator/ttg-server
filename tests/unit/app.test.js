const request = require("supertest");

const { app } = require("../../src/app");

describe("404 handler", () => {
  test("should return HTTP 404 response for nonexistent route", async () => {
    const response = await request(app).get("/notarealendpoint");

    expect(response.statusCode).toBe(404);
    expect(response.body).toStrictEqual({
      status: "error",
      error: {
        code: 404,
        message: "not found",
      },
    });
  });
});
