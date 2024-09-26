import nextConnect from 'next-connect';
import multer from 'multer';
import AWS from 'aws-sdk';

// Set up AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Set up Multer for S3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET,
    acl: 'public-read',  // Set file permissions
    key: function (req, file, cb) {
      cb(null, `uploads/${Date.now()}_${file.originalname}`);  // File name
    },
  }),
});

// Create a Next.js API route
const handler = nextConnect();

handler.use(upload.single('file')).post((req, res) => {
  const imageUrl = req.file.location;  // Get the URL of the uploaded image
  res.status(200).json({ imageUrl });
});

export default handler;
