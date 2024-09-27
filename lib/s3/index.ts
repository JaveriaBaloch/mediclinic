// src/lib/s3.ts

import { S3Client, PutObjectCommand, ObjectCannedACL } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';

// Configure the S3 client
const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
});

export const s3Upload = async (file: File): Promise<string> => {
  const fileExtension = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExtension}`;

  const uploadParams = {
    Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
    Key: fileName,
    Body: Buffer.from(await file.arrayBuffer()), // Convert file to Buffer
    ContentType: file.type,
    ACL: ObjectCannedACL.public_read_write, // Use predefined ACL
  };

  const command = new PutObjectCommand(uploadParams);
  await s3Client.send(command);

  return `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.amazonaws.com/${fileName}`; // Return the URL of the uploaded file
};
