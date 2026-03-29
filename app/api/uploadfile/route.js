// app/api/uploadfile/route.js
import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID1,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY1,
    },
    region: process.env.AWS_REGION1,
});

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const filename = `uploads/${Date.now()}_${file.name}`;

        // Upload to S3
        await s3.send(new PutObjectCommand({
            Bucket: process.env.S3_BUCKET1,
            Key: filename,
            Body: buffer,
            ContentType: file.type,
            ACL: 'public-read',
        }));

        // Build the URL
        const imageUrl = `https://${process.env.S3_BUCKET1}.s3.${process.env.AWS_REGION1}.amazonaws.com/${filename}`;

        return NextResponse.json({ imageUrl });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}