import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const saveFileToCloudinary = async (
  filePath,
  folder = 'general',
  publicId = 'file',
) => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: `pryrodni-mandry/${folder}`,
    resource_type: 'image',
    public_id: publicId,
    overwrite: true,
    unique_filename: false,
  });

  return result.secure_url;
};
