const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../../config/db");

class LoginController {
  // [GET] /login
  index(req, res) {
    res.send("Log In successfully");
  }

  // [POST] /login
  access(req, res) {
    db.query(`SELECT * FROM user_auth_info WHERE user_name = '${req.body.user_name}'`, (err, result) => {
      if (err || result.length == 0) {
        res.status(404).send({
          message: "user_non_existent",
          err,
        });
        console.log(err || "user_name not found");
      } else {
        const user = result[0];
        bcrypt
          .compare(req.body.password, user.password)

          // if the passwords match
          .then((passwordCheck) => {
            // check if password matches
            if (!passwordCheck) {
              return res.status(400).send({
                message: "password_was_wrong",
                // error,
              });
            }

            //   create JWT token
            const access_token = jwt.sign(
              {
                user_id: user.user_id,
                user_name: user.user_name,
              },
              process.env.ACCESS_TOKEN_SECRET_KEY,
              { expiresIn: process.env.ACCESS_TOKEN_DURATION },
            );

            const refresh_token = jwt.sign(
              {
                user_id: user.user_id,
                user_name: user.user_name,
              },
              process.env.REFRESH_TOKEN_SECRET_KEY,
              { expiresIn: process.env.REFRESH_TOKEN_DURATION },
            );

            //   return success res
            res.status(200).send({
              message: "Login Successful",
              access_token,
              refresh_token,
            });
          })
          .catch((error) => {
            response.status(400).send({
              message: "password_was_wrong",
              error,
            });
          });
      }
    });
  }
}

module.exports = new LoginController();
