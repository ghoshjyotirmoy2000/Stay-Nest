import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  region: "us-east-1",
  endpoint: process.env.MINIO_URL,
  credentials: {
    accessKeyId: process.env.MINIO_USER!,
    secretAccessKey: process.env.MINIO_PASSWORD!,
  },
  forcePathStyle: true,
});