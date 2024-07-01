const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    // console.log("req:", req.params.userId);
    // console.log("filename:", file.originalname);

    // cb(null, user_id);
    // cb(null, `${req.params.userId}.png`);
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
