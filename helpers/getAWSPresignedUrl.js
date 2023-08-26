const AWS = require('aws-sdk');

function getAWSPreSignedUrl(key) {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
  });
  const s3 = new AWS.S3();

  return s3.getSignedUrl('getObject', {
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    Expires: 60 * 5
  });
}

export default getAWSPreSignedUrl;
