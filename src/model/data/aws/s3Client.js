/**
 * S3 specific config and objects.  See:
 * https://www.npmjs.com/package/@aws-sdk/client-s3
 */
const { S3Client } = require("@aws-sdk/client-s3");
const { logger } = require("../../../lib/logger");

/**
 * If AWS credentials are configured in the environment, use them. Normally when we connect to S3
 * from a deployment in AWS, we won't bother with this.  But if you're testing locally, you'll need
 * these, or if you're connecting to LocalStack or MinIO
 * @returns Object | undefined
 */
function getCredentials() {
  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    // See https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/modules/credentials.html
    const credentials = {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      // Optionally include the AWS Session Token, too (e.g., if you're connecting to AWS from your laptop).
      // Not all situations require this, so we won't check for it above, just use it if it is present.
      sessionToken: process.env.AWS_SESSION_TOKEN,
    };
    logger.debug(
      "Using extra S3 Credentials AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY",
    );
    return credentials;
  }
}

/**
 * If an AWS S3 Endpoint is configured in the environment, use it.
 * @returns string | undefined
 */
function getS3Endpoint() {
  if (process.env.AWS_S3_ENDPOINT_URL) {
    logger.debug(
      { endpoint: process.env.AWS_S3_ENDPOINT_URL },
      "Using alternate S3 endpoint",
    );
    return process.env.AWS_S3_ENDPOINT_URL;
  }
}

/**
 * Configure and export a new s3Client to use for all API calls.
 * NOTE: we want to use this client with both AWS S3, but also
 * MinIO and LocalStack in development and testing. We may or may
 * not have various configuration settings, and will pass
 * `undefined` when we don't (i.e. we'll ignore them).
 */
const s3Client = new S3Client({
  // The region is always required
  region: process.env.AWS_REGION,
  // Credentials are optional (only MinIO needs them, or if you connect to AWS remotely from your laptop)
  credentials: getCredentials(),
  // The endpoint URL is optional
  endpoint: getS3Endpoint(),
  // We always want to use path style key names
  forcePathStyle: true,
  // Client version 3.729.0 introduced a modification to the default checksum behavior from the client that is currently incompatible with R2 APIs.
  // To mitigate, users can use 3.726.1 or add the following to their S3Client config:
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});

module.exports = { s3Client };
