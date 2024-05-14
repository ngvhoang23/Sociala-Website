const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../../config/db");

const authFunction = require("../authFunction/authFunction");

class LogoutController {
  // [POST] /logout
  logout = (req, res) => {
    const { refresh_token } = req.body;
    authFunction
      .disableRefreshToken()
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  };
}

module.exports = new LogoutController();
