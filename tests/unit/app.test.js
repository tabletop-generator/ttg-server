const request = require("supertest");

const app = require("../../src/app");

describe("404 handler", () => {
  test("should return HTTP 404 response for nonexistent route", () =>
    request(app).get("/notarealendpoint").expect(404));
});
