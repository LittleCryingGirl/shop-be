import { S3 } from 'aws-sdk';
import { BUCKET, EXPIRATION } from "../../constants";
import { createResponse } from "../../helpers";

export const importProductsFile = async ({queryStringParameters}) => {
  if (!queryStringParameters?.name) {
    return createResponse(400, {
      error: "Bad request",
      message: "Wrong params"
    });
  }
  const s3 = new S3({ region: 'eu-west-1' });

  try {
    const s3Response = await s3.getSignedUrlPromise('putObject', {
      Bucket: BUCKET,
      Key: `uploaded/${queryStringParameters.name}`,
      Expires: EXPIRATION,
      ContentType: 'text/csv'
    });
    console.log(JSON.stringify(s3Response));

    return createResponse(200, s3Response);
  } catch (e) {
    console.error(e.toString());

    return createResponse(500, e)
  }

};
