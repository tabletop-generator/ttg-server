const logger = require("../../../logger");
const comment = require("../../../model/comment");
const { createSuccessResponse } = require("../../../response");

/**
 * Delete a comment by its id
 * Both the comment author and the asset owner can delete comments
 */

module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, id: req.params.commentId },
    `received request: DELETE /v1/comments/:commentId`,
  );

  const commentId = req.params.commentId;

  try {
    // Use the comment model to handle delete logic
    await comment.deleteById(req.user, commentId);

    return res
      .status(200)
      .json(createSuccessResponse({ message: "Comment deleted successfully" }));
  } catch (error) {
    // Pass error to error handler middleware
    return next(error);
  }
};
