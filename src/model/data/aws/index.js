const {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const s3Client = require("./s3Client");
const logger = require("../../../logger");

// Writes a buffer to an S3 Object in a Bucket
// https://github.com/awsdocs/aws-sdk-for-javascript-v3/blob/main/doc_source/s3-example-creating-buckets.md#upload-an-existing-object-to-an-amazon-s3-bucket
async function uploadDataToS3(key, buffer, mimeType) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
  };

  const command = new PutObjectCommand(params);

  try {
    logger.debug(
      { bucket: params.Bucket, key: params.Key, contentType: params.mimeType },
      "uploading data to S3",
    );
    await s3Client.send(command);
  } catch (err) {
    logger.warn({ err, params }, "error uploading data to S3");
    throw err;
  }
}

async function createPresignedUrl(key) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
  };

  const command = new GetObjectCommand(params);

  try {
    // Calculate the expiration time
    const urlExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const url = await getSignedUrl(s3Client, command);

    return { url, urlExpiry };
  } catch (error) {
    const { Bucket, Key } = params;
    logger.warn({ error, Bucket, Key }, "error creating presigned url from S3");
    throw error;
  }
}

async function deleteDataFromS3(key) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
  };

  const command = new DeleteObjectCommand(params);
  try {
    await s3Client.send(command);
  } catch (err) {
    const { Bucket, Key } = params;
    logger.warn({ err, Bucket, Key }, "error deleting data from S3");

    throw err;
  }
}

module.exports.uploadDataToS3 = uploadDataToS3;
module.exports.deleteDataFromS3 = deleteDataFromS3;
module.exports.createPresignedUrl = createPresignedUrl;
