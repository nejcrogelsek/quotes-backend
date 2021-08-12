import * as AWS from 'aws-sdk'
import * as dotenv from 'dotenv'
import { randomBytes } from 'crypto'

dotenv.config();

const bucketName = process.env.AWS_STORAGE_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new AWS.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: 'v4'
});

// uploads a file to s3 and get image URL
export const generateUploadUrl = async () => {
    const rawBytes = randomBytes(16);
    const imageName = rawBytes.toString('hex');

    const params = ({
        Bucket: bucketName,
        Key: imageName,
        Expires: 60
    });

    const uploadURL = await s3.getSignedUrlPromise('putObject', params);
    return uploadURL;
}