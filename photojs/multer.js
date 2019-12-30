const multer = require("multer"); // photo upload

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./data/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter }); //photo upload
module.exports = upload;
