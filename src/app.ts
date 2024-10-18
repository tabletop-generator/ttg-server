import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import { version } from "../package.json";

// Create an express app instance we can use to attach middleware and HTTP routes
const app = express();

// Use helmetjs security middleware
app.use(helmet());

// Use CORS middleware so we can make requests across origins
app.use(cors());

// Define a simple health check route. If the server is running
// we'll respond with a 200 OK.  If not, the server isn't healthy.
app.get("/", (req, res) => {
  // Clients shouldn't cache this response (always request it fresh)
  // See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching#controlling_caching
  res.setHeader("Cache-Control", "no-cache");

  // Send a 200 'OK' response with info about our repo
  res.status(200).json({
    status: "ok",
    githubUrl: "https://github.com/tabletop-generator/server/",
    version,
  });
});

// Add 404 middleware to handle any requests for resources that can't be found
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    error: {
      message: "not found",
      code: 404,
    },
  });
});

interface CustomError extends Error {
  status?: number;
}

// Add error-handling middleware to deal with anything else
/* eslint-disable @typescript-eslint/no-unused-vars */
app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  // We may already have an error response we can use, but if not,
  // use a generic `500` server error and message.
  const status = err.status ?? 500;
  const message = err.message || "unable to process request";

  // If this is a server error, log something so we can see what's going on.
  if (status > 499) {
    console.error({ err }, `Error processing request`);
  }

  res.status(status).json({
    status: "error",
    error: {
      message,
      code: status,
    },
  });
});

// Export our `app` so we can access it in server.js
export default app;
