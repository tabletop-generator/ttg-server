const compression = require("compression");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const passport = require("passport");
const { pinoHttp } = require("pino-http");
const OpenApiValidator = require("express-openapi-validator");

const { strategy } = require("./lib/auth");
const { logger } = require("./lib/logger");
const { createHttpError } = require("./lib/error");

const pino = pinoHttp({
  // Use our default logger instance, which is already configured
  logger,
});

// Create an express app instance we can use to attach middleware and HTTP routes
const app = express();

// Use pino logging middleware
app.use(pino);

// Use helmetjs security middleware
app.use(helmet());

// Use CORS middleware so we can make requests across origins
app.use(cors());

// Use gzip/deflate compression middleware
app.use(compression());

// Set up our passport authentication middleware
passport.use(strategy);
app.use(passport.initialize());

// Use JSON body parser
app.use(express.json());

// Use OpenAPI validator
app.use(
  OpenApiValidator.middleware({
    apiSpec: "./openapi.yaml",
    validateRequests: true,
  }),
);

// Define our routes
app.use("/", require("./routes"));

// Add 404 middleware to handle any requests for resources that can't be found
app.use((req, res, next) => {
  return next(createHttpError(404, "not found"));
});

// Add error-handling middleware to deal with anything else
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // We may already have an error response we can use, but if not,
  // use a generic `500` server error and message.
  const status = err.status ?? 500;
  const message = err.message || "unable to process request";

  // If this is a server error, log something so we can see what's going on.
  if (status > 499) {
    logger.error({ err, message: err.message }, `Error processing request`);
  }

  res.status(status).json({
    status: "error",
    error: {
      code: status,
      message: message,
    },
  });
});

// Export our `app` so we can access it in server.js
module.exports = { app };
