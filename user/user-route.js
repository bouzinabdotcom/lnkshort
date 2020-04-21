const express = require("express"),
  router = express.Router(),
  bcrypt = require("bcrypt"),
  User = require("./user");

router.post("/", (req, res) => {
  bcrypt
    .hash(req.body.pwd, 10)
    .then(async (encPwd) => {
      let user = new User({
        username: req.body.username,
        pwd: encPwd,
        email: req.body.email,
      });

      console.log(user);
      try {
        await user.save();
      } catch (e) {
        return res.status(500).send(e.message);
      }

      res.send({
        username: user.username,
        status: "OK",
      });
    })
    .catch((err) => res.status(500).send("server error"));
});

module.exports = router;
