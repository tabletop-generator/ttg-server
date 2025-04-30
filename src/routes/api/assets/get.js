const { listAssets } = require("../../../model/asset");
const { logger } = require("../../../lib/logger");
const { createHttpError } = require("../../../lib/error");

/**
 * Get a list of assets filtered by the query
 */

module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, query: req.query },
    `received request: GET /v1/assets`,
  );

  let assets;
  try {
    assets = await listAssets(req.user, req.query);
  } catch (error) {
    logger.error({ error, message: error.message }, "error getting asset list");
    return next(createHttpError(500, "Error getting asset list"));
  }

  return res.status(200).json({ assets });
};
