const moment = require('moment');
const transporter = require('../../config/nodemailer/nodemailer');
const jwt = require('jsonwebtoken');
const db = require('../../config/db');
const { generateTokens, verifyRefreshToken, verifyRefreshTokenInDB } = require('../../auth/tokenFunction');

class TokenController {
  sendVerificationEmail = (user) => {
    const mailOptions = {
      from: 'phuoclongahi@gmail.com',
      to: user.email,
      subject: 'Email Verification',
      html: user.html,
    };

    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          resolve(info);
        }
      });
    });
  };

  getNewNewAccessToken = (req, res) => {
    const { refresh_token } = req.body;

    let decoded_payload;

    verifyRefreshToken(refresh_token)
      .then((result) => {
        decoded_payload = result.decoded;
        return verifyRefreshTokenInDB(refresh_token);
      })
      .then((result) => {
        return new Promise((resolve, reject) => {
          const sql = `replace into refresh_token_black_list(blocked_refresh_token) values('${refresh_token}')`;
          db.query(sql, (err, result) => {
            if (err) {
              reject({ message: 'Verify Refresh Token Failed', err });
            } else {
              resolve(result);
            }
          });
        });
      })
      .then((result) => {
        const { user_id, user_name } = decoded_payload;
        return generateTokens(user_id, user_name);
      })
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        console.log('err: ', err);
        res.status(403).send(err);
      });
  };

  disableRefreshToken = (req, res) => {
    const promise = () => {
      return new Promise((resolve, reject) => {
        const { refresh_token } = req.body;

        const sql = `insert into refresh_token_black_list(blocked_refresh_token) values('${refresh_token}')`;

        db.query(sql, (err, result) => {
          if (err) {
            reject({ message: 'Disable Refresh Token Failed', err });
          } else {
            resolve(result);
          }
        });
      });
    };

    promise()
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send(err);
      });
  };
}

module.exports = new TokenController();
