const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  jwt.verify(
    req.header("x-auth-token"),
    process.env.JWT_SECRET,
    (err, decoded) => {
      if (err)
        return res
          .status(400)
          .send("You need to be Authenticated for this operation");
      req.user = decoded.user;
      next();
    }
  );
};
