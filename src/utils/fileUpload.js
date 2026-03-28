export const getUploadedFile = (req) => {
  if (!req) return null;
  if (req.file && req.file.buffer) return req.file;

  if (req.files) {
    if (req.files.img && req.files.img[0]) return req.files.img[0];
    if (req.files.image && req.files.image[0]) return req.files.image[0];
    if (req.files.file && req.files.file[0]) return req.files.file[0];
    const firstField = Object.keys(req.files)[0];
    if (firstField && req.files[firstField] && req.files[firstField][0])
      return req.files[firstField][0];
  }

  return null;
};

export default getUploadedFile;
