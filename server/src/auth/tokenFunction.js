const jwt = require("jsonwebtoken");
const db = require("../config/db");
const moment = require("moment");
const bcrypt = require("bcrypt");

generateTokens = async (user_id, user_name) => {
  try {
    const payload = { user_id: user_id, user_name: user_name };
    const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET_KEY, {
      expiresIn: process.env.ACCESS_TOKEN_DURATION,
    });
    const refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET_KEY, {
      expiresIn: process.env.REFRESH_TOKEN_DURATION,
    });

    return Promise.resolve({ access_token, refresh_token });
  } catch (err) {
    return Promise.reject(err);
  }
};

verifyRefreshToken = async (refresh_token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET_KEY, (err, decoded) => {
      if (err) {
        console.log("error");
        reject(err);
      } else {
        resolve({ decoded, message: "Valid refresh token" });
      }
    });
  });
};

verifyRefreshTokenInDB = (refresh_token) => {
  return new Promise((resolve, reject) => {
    const sql = `select * from refresh_token_black_list where blocked_refresh_token = '${refresh_token}'`;

    db.query(sql, (err, result) => {
      if (err) {
        reject({ message: "Verify Refresh Token Failed", err });
      } else {
        if (result.length == 0) {
          resolve(result);
        } else {
          reject({ message: "Refresh Token Is Reuse" });
        }
      }
    });
  });
};

module.exports = {
  generateTokens,
  verifyRefreshToken,
  verifyRefreshTokenInDB,
};
