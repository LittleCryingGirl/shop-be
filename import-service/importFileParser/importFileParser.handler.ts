import { S3 } from "aws-sdk";
import { BUCKET } from "../../constants";
import * as csv from 'csv-parser';
import { Readable } from "stream";
import { createResponse } from "../../helpers";


export const importFileParser = async (event) => {
  const s3 = new S3({ region: 'eu-west-1' });
  for (const record of event.Records) {
    console.log('record: ', record);
    try {
      const stream = s3.getObject({Bucket: BUCKET, Key: record.s3.object.key}).createReadStream();
      return parseCsvFile(s3, stream, record.s3.object.key)
        .then(data => createResponse(200, data))
        .catch(e => createResponse(500, e));
    } catch (e) {
      console.log('Error: ', JSON.stringify(e));
      createResponse(500, e);
    }
  }
};

const parseCsvFile = (s3: S3, stream: Readable, key: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    stream
      .pipe(csv())
      .on('data', (data) => {
        console.log('Data event', data);
      })
      .on('error', (error) => reject(error))
      .on('end', async (data) => {
        console.log('End data: ', data);
        const destination = key.replace('uploaded', 'parsed');
        console.log(`Move file from ${BUCKET}/${key} to ${destination}`);

        await s3.copyObject({
          Bucket: BUCKET,
          CopySource: `${BUCKET}/${key}`,
          Key: destination
        }).promise();

        console.log(`Remove ${BUCKET}/${key}`)

        await s3.deleteObject({
          Bucket: BUCKET,
          Key: key
        }).promise();

        resolve();
      })
  })
}
