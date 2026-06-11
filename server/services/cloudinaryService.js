import { v2 as cloudinary } from 'cloudinary';

// 🟢 Yeh function tabhi chalega jab hum file upload ya delete karenge
const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
};

const ensureCloudinaryConfig = () => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    const error = new Error('Cloudinary environment variables are not configured');
    error.status = 500;
    throw error;
  }
};

export const uploadPdfToCloudinary = async (filePath, folder) => {
  ensureCloudinaryConfig();
  configureCloudinary(); // 🟢 Upload se theek pehle config load hoga
  
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'raw',
      use_filename: true,
      unique_filename: true,
      overwrite: false
    });

    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw error;
  }
};

export const deleteCloudinaryFile = async (publicId) => {
  if (!publicId) return;
  ensureCloudinaryConfig();
  configureCloudinary(); // 🟢 Delete se theek pehle config load hoga
  
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
    throw error;
  }
};