// server/src/config/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'gst-invoice-app/avatars', // Folder in Cloudinary
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' }, // Auto-crop to face
        { quality: 'auto' }, // Automatic quality optimization
      ],
      public_id: `avatar_${Date.now()}`, // Unique filename
    };
  },
});

// Create multer upload middleware
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

export default cloudinary;
