const express = require("express");
const Photo = require("../db/photoModel");
const router = express.Router();
const Avatar = require("../db/avatarModel");

const auth = require("../middleware/auth");

const fs = require("fs");

const upload = require("../middleware/multerConfig");

router.post("/", async (request, response) => {});

router.get("/photosOfUser", async (request, response) => {
  try {
    const photo = await Photo.find({});
    response.send(photo);
  } catch (error) {
    response.status(500).send({ error });
  }
});

router.get("/photosOfUser/:id", auth, async (request, response) => {
  try {
    const photo = await Photo.find({ user_id: request.params.id });

    response.send(photo);
  } catch (error) {
    response.status(500).send({ error });
  }
});

router.post(
  "/uploadimage",
  auth,
  upload.single("myImage"),
  async (req, res, next) => {
    try {
      const img = fs.readFileSync(req.file.path);

      const encode_image = img.toString("base64");

      const newPhoto = new Photo({
        file_name: req.file.filename,
        user_id: req.body.user_id,
        comments: [],
        encode_image: encode_image,
      });

      await newPhoto.save();
      fs.unlinkSync(req.file.path);

      console.log("Photo saved to database:", newPhoto.file_name);

      res.status(200).json({ message: "Photo uploaded successfully" });
    } catch (error) {
      console.error("Error uploading photo:", error);
      res.status(500).json({ error: "Error uploading photo" });
    }
  }
);

router.delete("/deleteimage/:photoId", auth, async (request, response) => {
  try {
    const deletedPhoto = await Photo.findOneAndDelete({
      _id: request.params.photoId,
    });

    if (!deletedPhoto) {
      return response.status(404).send({ error: "Không tìm thấy ảnh để xóa." });
    }

    response.status(200).send({ message: "Xóa ảnh thành công.", deletedPhoto });
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

router.post("/commentsOfPhoto/:photo_id", auth, async (request, response) => {
  try {
    const photo = await Photo.findOne({ _id: request.params.photo_id });

    console.log(request.body);

    const newComment = {
      comment: request.body.comment,
      date_time: new Date(),
      user_id: request.body.user_id,
    };

    photo.comments.push(newComment);

    await photo.save();

    response.status(200).send({ message: "Comment added successfully" });
  } catch (error) {
    response.status(500).send({ error });
  }
});

// avatar router

router.post(
  "/uploadavatar/:userId",
  auth,
  upload.single("myImage"),
  async (req, res, next) => {
    try {
      const file_name = req.file.filename;
      const user_id = req.body.user_id;
      const img = fs.readFileSync(req.file.path);
      const encode_image = img.toString("base64");

      const existingAvatar = await Avatar.findOne({ user_id: user_id });

      if (existingAvatar) {
        await Avatar.deleteOne(existingAvatar);
        console.log("Deleted old avatar");
      }

      const newAvatar = new Avatar({
        file_name,
        user_id,
        encode_image: encode_image,
      });

      await newAvatar.save();
      fs.unlinkSync(req.file.path);

      console.log("newAvatar saved to database:", newAvatar.file_name);

      res.status(200).json({ message: "Avatar uploaded successfully" });
    } catch (error) {
      console.error("Error uploading photo:", error);
      res.status(500).json({ error: "Error uploading newAvatar" });
    }
  }
);

router.get("/avatarOfUser/:userId", async (request, response) => {
  try {
    const avatar = await Avatar.findOne({ user_id: request.params.userId });
    response.send(avatar);
  } catch (error) {
    response.status(500).send({ error });
  }
});

module.exports = router;
