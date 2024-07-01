const express = require("express");
const User = require("../db/userModel");
const router = express.Router();
const auth = require('../middleware/auth');

router.post("/", async (request, response) => {});

router.get("/list", auth , async (request, response) => {
  try {
    const user = await User.find({}).select("_id first_name last_name");
    response.send(user);

  } catch (error) {
    response.status(500).send({ error });
  }
});

router.get("/:id", async (request, response) => {
  try {
    const user = await User.findOne({ _id: request.params.id });
    response.send(user);
  } catch (error) {
    response.status(500).send({ error });
  }
});

module.exports = router;
