const logger = require("../../../logger");
const comment = require("../../../model/comment");
const { createSuccessResponse } = require("../../../response");

/**
 * Create a comment
 */

module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, body: req.body },
    `received request: POST /v1/comments`,
  );

  // Validate request format
  try {
    comment.schema.parse(req.body);
  } catch (error) {
    logger.debug({ error }, "invalid comment data");
    const httpError = new Error("Invalid comment data");
    httpError.status = 400;
    return next(httpError);
  }

  // Create comment
  try {
    const newComment = await comment.create(req.user, req.body);

    logger.debug(
      { comment: newComment },
      `created new comment with id ${newComment.id}`,
    );

    // Return comment data
    return res.status(201).json(createSuccessResponse({ comment: newComment }));
  } catch (error) {
    return next(error);
  }
};
