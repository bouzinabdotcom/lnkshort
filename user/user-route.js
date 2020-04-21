const express = require("express"),
  router = express.Router(),
  bcrypt = require("bcrypt"),
  User = require("./user"),
  jwt = require("jsonwebtoken"),
  auth = require("../middleware/auth");

router.post("/", (req, res) => {
  bcrypt
    .hash(req.body.pwd, 10)
    .then(async (encPwd) => {
      let user = new User({
        username: req.body.username,
        pwd: encPwd,
        email: req.body.email,
      });

      try {
        await user.save();
      } catch (e) {
        return res.status(500).send(e.message);
      }

      res.send({
        username: user.username,
        status: "created",
      });
    })
    .catch((err) => res.status(500).send("server error"));
});

router.put("/:username", auth, async (req, res) => {
  let user;
  try {
    user = await User.findOne({ username: req.params.username });
  } catch (e) {
    return res.status(500).send(e.message);
  }
  if (!user) return res.status(404).send("User not found.");
  if (user.username !== req.user)
    return res.status(400).send("You are not allowed to perform this task.");

  user.username = req.body.username;
  user.email = req.body.email;

  try {
    await user.save();
  } catch (e) {
    return res.status(500).send(e.message);
  }

  res.send({
    username: user.username,
    email: user.email,
    status: "updated",
  });
});

router.put("/reset-pwd/:username", auth, async (req, res) => {
  let user;
  try {
    user = await User.findOne({ username: req.params.username });
  } catch (e) {
    return res.status(500).send(e.message);
  }
  if (!user) return res.status(404).send("User not found.");
  if (user.username !== req.user)
    return res.status(400).send("You are not allowed to perform this task.");
  bcrypt
    .compare(req.body.oldPwd, user.pwd)
    .then((result) => {
      if (result)
        bcrypt
          .hash(req.body.newPwd, 10)
          .then(async (newEncPwd) => {
            user.pwd = newEncPwd;
            try {
              await user.save();
            } catch (e) {
              return res.status(500).send(e.message);
            }

            res.send({
              username: user.username,
              status: "Password updated",
            });
          })
          .catch((err) => res.status(500).send("server error"));
      else return res.status(400).send("Wrong password");
    })
    .catch((err) => res.status(500).send("server error"));
});

router.post("/auth", async (req, res) => {
  let user;
  try {
    user = await User.findOne({ username: req.body.username });
  } catch (e) {
    return res.status(500).send(e.message);
  }
  if (!user) return res.status(400).send("Username or Password wrong");

  bcrypt
    .compare(req.body.pwd, user.pwd)
    .then((result) => {
      if (result)
        res.send({
          username: user.username,
          token: jwt.sign(
            {
              user: user.username,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "1d",
            }
          ),
          status: "Authenticated",
        });
      else return res.status(400).send("Username or Password wrong");
    })
    .catch((err) => res.status(500).send("server error"));
});

router.delete("/:username", auth, async (req, res) => {
  let user;
  try {
    user = await User.findOne({ username: req.params.username });
  } catch (e) {
    return res.status(500).send(e.message);
  }
  if (!user) return res.status(404).send("User not found.");
  if (user.username !== req.user)
    return res.status(400).send("You are not allowed to perform this task.");

  try {
    await user.delete();
  } catch (e) {
    return res.status(500).send(e.message);
  }

  res.send({
    username: user.username,
    status: "deleted",
  });
});

module.exports = router;
