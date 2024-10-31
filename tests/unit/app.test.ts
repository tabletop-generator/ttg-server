import request from "supertest";

import app from "../../src/app";

describe("404 handler", () => {
  test("nonexistent routes return HTTP 404 response", () =>
    request(app).get("/notarealendpoint").expect(404));
});
