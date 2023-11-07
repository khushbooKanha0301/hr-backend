const util = require("util");
const multer = require("multer");
const path = require("path");
const maxSize = 2 * 1024 * 1024;

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/uploads/");
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const extension = path.extname(file.originalname);
    const originalFileName = path.basename(file.originalname, extension);
    const fileName = `${originalFileName.replace(
      / /g,
      "_"
    )}_${timestamp}${extension}`;
    file.newFileName = fileName;
    cb(null, fileName);
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("resume");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
