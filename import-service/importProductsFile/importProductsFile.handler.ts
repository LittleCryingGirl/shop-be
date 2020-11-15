import { S3 } from 'aws-sdk';

const BUCKET = 'import-service-example';

export const importProductsFile = async () => {
  const s3 = new S3({ region: 'eu-west-1' });
  const params = {
    Bucket: BUCKET,
    Prefix: 'import-service'
  }

  try {
    const s3Response = await s3.listObjectsV2(params).promise();
    const imports = s3Response.Contents;
  }
};
