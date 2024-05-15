const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../config/db');
const moment = require('moment');
const tokenController = require('./TokenController');
const { formatDate } = require('../../UserDefinedFunctions');
const { generateTokens } = require('../../auth/tokenFunction');

require('dotenv').config();

class RegisterController {
  // [GET] /register
  index(req, res) {
    res.send('Register successfully');
  }

  // [POST] /register
  store(req, res) {
    const { email_address, password, birth_date } = req.body;

    if (!email_address || !password || !birth_date) {
      res.status(400).send({ message: 'Information Is Invalid' });
      return;
    }

    if (formatDate(new Date()).split('-')[0] - birth_date.split('-')[0] < process.env.MINIMUM_AGE_REQUIRED) {
      console.log('YOU ARE NOT OLD ENOUGH');
      res.status(400).send({ message: 'YOU ARE NOT OLD ENOUGH' });
      return;
    }

    const checkingPromise = () => {
      return new Promise((resolve, reject) => {
        const data = [`${email_address}`];
        db.query(`select * from user_auth_info where user_name=? and verified_at is not null`, data, (err, result) => {
          if (err) {
            reject({ message: 'Checking User Failed', err });
          } else {
            if (result.length == 0) {
              resolve(result);
            } else {
              reject({ message: 'User_Existed' });
            }
          }
        });
      });
    };

    const promise = () =>
      new Promise((resolve, reject) => {
        bcrypt
          .hash(password, 10)
          .then((hashedPassword) => {
            db.query(
              `REPLACE INTO user_auth_info(user_name, password, auth_email) 
                    VALUES("${email_address}", "${hashedPassword}", "${email_address}")`,
              (err, result) => {
                if (err) {
                  reject({
                    message: 'Error creating user',
                    err,
                  });
                } else {
                  resolve({
                    message: 'User Created Successfully',
                    result,
                  });
                }
              },
            );
          })
          .catch((err) => {
            reject({
              message: 'Password was not hashed successfully',
              err,
            });
          });
      });

    checkingPromise()
      .then((result) => {
        return promise();
      })
      .then((result) => {
        return new Promise((resolve, reject) => {
          const payload = { user_id: result.result.insertId, email_address: email_address, birth_date: birth_date };
          const key = process.env.EMAIL_VERIFICATION_PRIVATE_KEY;
          jwt.sign(payload, key, { expiresIn: process.env.EMAIL_VERIFICATION_DURATION }, (err, token) => {
            if (err) {
              reject(err);
            } else {
              resolve(token);
            }
          });
        });
      })
      .then((token) => {
        const html = `<p>Click <a href="http://localhost:3000/verification/${token}">here</a> to verify your email.</p>`;
        return tokenController.sendVerificationEmail({ email: email_address, verification_token: token, html });
      })
      .then((result) => {
        res.status(201).send({
          message: 'Token Sent Successfully',
          result,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send(err);
      });
  }

  // [POST] /register/verification/:token
  verifyToken = (req, res) => {
    const { verification_token } = req.body;
    const key = process.env.EMAIL_VERIFICATION_PRIVATE_KEY;

    const promise = () => {
      return new Promise((resolve, reject) => {
        jwt.verify(verification_token, key, (err, result) => {
          if (err) {
            reject({
              message: 'Verify Email Failed',
              err,
            });
          } else {
            resolve({ message: 'Verify Email Successfully', result });
          }
        });
      });
    };

    promise()
      .then((result) => {
        const { email_address, user_id, birth_date } = result.result;
        const verified_at = moment().valueOf();
        return new Promise((resolve, reject) => {
          db.query(
            `update user_auth_info
            set verified_at = '${verified_at}'
            where user_name = '${email_address}'`,
            (err, result) => {
              if (err) {
                reject({ message: 'Update Verification Failed', err });
              } else {
                resolve({
                  message: 'Update Verification Successfully',
                  result: { email_address, user_id, birth_date },
                });
              }
            },
          );
        });
      })
      .then((result) => {
        const { email_address, user_id, birth_date } = result.result;
        return new Promise((resolve, reject) => {
          generateTokens(user_id, email_address)
            .then((result) => {
              resolve({
                user_id,
                user_name: email_address,
                access_token: result.access_token,
                refresh_token: result.refresh_token,
              });
            })
            .catch((err) => {
              reject(err);
            });
        });
      })
      .then((result) => {
        res.status(201).send(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send(err);
      });
  };
}

module.exports = new RegisterController();
