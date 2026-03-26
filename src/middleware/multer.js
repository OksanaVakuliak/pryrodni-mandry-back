import multer from 'multer';
import createHttpError from 'http-errors';

const storage = multer.memoryStorage();

const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

const fileFilter = (req, file, cb) => {
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      createHttpError(400, 'Only .jpg, .png, .webp images are allowed'),
      false,
    );
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
