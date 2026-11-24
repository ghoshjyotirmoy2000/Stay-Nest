import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/s3";

export const generatePresignedUrl = async (
  folder: string,       // "images/hotel" or "images/room"
  contentType: string,  // "image/jpeg"
  bucketName: string,   // "staynest"
) => {
  const ext = contentType.split("/")[1];
  const imagePath = `${folder}/${Date.now()}.${ext}`;

  const putUrl = await getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: bucketName,
      Key: imagePath,
      ContentType: contentType,
    }),
    { expiresIn: 3600 },
  );

  return {
    putUrl,
    finalImageUrl: `${process.env.MINIO_URL}/${bucketName}/${imagePath}`,
  };
};