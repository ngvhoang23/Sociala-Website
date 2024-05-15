const moment = require('moment');
const transporter = require('../../config/nodemailer/nodemailer');
const jwt = require('jsonwebtoken');
const db = require('../../config/db');
const bcrypt = require('bcrypt');
const { sendVerificationEmail } = require('./TokenController');
const tokenController = require('./TokenController');
const crypto = require('crypto');
const { generateToken } = require('../../UserDefinedFunctions');

class AuthController {
  static emailValidationTokens = [];

  // [PUT] /password/
  changePassword = (req, res) => {
    const { old_password, new_password } = req.body;
    const user_id = req.userInfo.user_id;

    const checkingOldPassword = () => {
      return new Promise((resolve, reject) => {
        db.query(`select * from user_auth_info where user_id = ${user_id}`, (error, result) => {
          if (error) {
            reject(error);
          } else {
            const password = result[0].password;
            bcrypt.compare(old_password, password).then((passwordCheck) => {
              if (!passwordCheck) {
                reject({
                  message: 'WRONG_PASSWORD',
                });
              } else {
                resolve(1);
              }
            });
          }
        });
      });
    };

    const promise = () => {
      return new Promise((resolve, reject) => {
        bcrypt.hash(new_password, 10).then((hashed_password) => {
          db.query(
            `update user_auth_info set password='${hashed_password}' where user_id=${user_id}`,
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve({ message: 'CHANGE_PASSWORD_SUCCESSFULLY', result });
              }
            },
          );
        });
      });
    };

    checkingOldPassword()
      .then((result) => {
        return promise();
      })
      .then((result) => {
        res.status(201).send(result);
      })
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  };

  checkingEmailExisted = (user_name) => {
    return new Promise((resolve, reject) => {
      db.query(
        `select * from user_auth_info where user_name='${user_name}' or auth_email='${user_name}'`,
        (err, result) => {
          if (err) {
            reject({ err });
          } else {
            if (result.length === 0) {
              reject({ message: 'NOT_EXIST' });
            } else {
              resolve({ user_name: result[0].user_name, user_id: result[0].user_id });
            }
          }
        },
      );
    });
  };

  // [GET] /password-reset-token/:user_name
  getPasswordResetToken = (req, res) => {
    const { user_name } = req.query;

    const promise = () => {
      return new Promise((resolve, reject) => {
        this.checkingEmailExisted(user_name)
          .then((result) => {
            const { user_name, user_id } = result;
            const token = crypto.randomBytes(16).toString('hex');
            bcrypt.hash(token, 10).then((hashed_token) => {
              db.query(
                `replace into password_reset_tokens(user_id, token, expired_at)
               values(${user_id}, '${hashed_token}', '${moment().add(30, 'seconds').valueOf()}')`,
                (error, result) => {
                  if (error) {
                    reject(error);
                  } else {
                    resolve({ user_name: user_name, token: token, user_id });
                  }
                },
              );
            });
          })
          .catch((err) => {
            reject(err);
          });
      });
    };

    promise()
      .then((result) => {
        const { user_name, token, user_id } = result;
        const html = `<p>Click <a href="http://localhost:3000/reset-password/${user_id}/${token}">here</a> to reset your password.</p>`;
        return sendVerificationEmail({ email: user_name, verification_token: token, html });
      })
      .then((result) => {
        res.status(200).send({ timeout: 30 });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send(err);
      });
  };

  verifyPasswordResetToken = (user_id, token) => {
    const getHashedTokenFromDB = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `select * from password_reset_tokens where user_id=${user_id} and FROM_UNIXTIME(expired_at / 1000) > now()`,
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              if (result.length === 0) {
                reject({ message: 'WRONG_TOKEN' });
              } else {
                resolve(result[0].token);
              }
            }
          },
        );
      });
    };

    return new Promise((resolve, reject) => {
      getHashedTokenFromDB()
        .then((hashed_token) => {
          bcrypt.compare(token, hashed_token).then((token_check) => {
            if (!token_check) {
              reject({
                message: 'WRONG_TOKEN',
              });
            } else {
              resolve(1);
            }
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  validateEmailToken(token) {
    const isValid = AuthController.emailValidationTokens.some((_token) => _token === token);
    return isValid;
  }

  // [POST] /new-password
  setNewPassword = (req, res) => {
    const { user_id, new_password, verification_token } = req.body;

    const insertPasswordToDB = () => {
      return new Promise((resolve, reject) => {
        bcrypt
          .hash(new_password, 10)
          .then((hashed_password) => {
            db.query(
              `update user_auth_info set password='${hashed_password}' where user_id=${user_id}`,
              (err, result) => {
                if (err) {
                  console.log(err);
                  reject(err);
                } else {
                  resolve(result);
                }
              },
            );
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    };

    this.verifyPasswordResetToken(user_id, verification_token)
      .then((result) => {
        return insertPasswordToDB().catch((err) => {
          console.log(err);
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

  // [POST] /email/verifying
  getTokenToVerifyEmail = (req, res) => {
    const { email_address } = req.body;
    const { user_id } = req.userInfo;

    const sendToken = () => {
      return new Promise((resolve, reject) => {
        const token = generateToken(6);
        const html = `<p>This is you verification code: ${token}</p>`;
        const duration = 30000;
        tokenController
          .sendVerificationEmail({ email: email_address, verification_token: token, html })
          .then((result) => {
            AuthController.emailValidationTokens.push(token);
            setTimeout(() => {
              console.log(AuthController.emailValidationTokens);
              AuthController.emailValidationTokens = AuthController.emailValidationTokens.filter(
                (_token) => _token != token,
              );
              console.log(AuthController.emailValidationTokens);
            }, duration);

            resolve(duration);
          })
          .catch((err) => {
            reject(err);
          });
      });
    };

    sendToken()
      .then((result) => {
        res.status(201).send({
          message: 'Token Sent Successfully',
          duration: result,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send(err);
      });
  };

  // [POST] /email/
  changeEmail = (req, res) => {
    const { user_id } = req.userInfo;
    const { email, token } = req.body;

    const checkEmail = () => {
      return new Promise((resolve, reject) => {
        const sql = `select * from user_auth_info
        where (user_name = ? or auth_email = ?) and user_id <> ?`;
        const data = [email, email, user_id];
        db.query(sql, data, (err, result) => {
          if (err) {
            reject(err);
          } else {
            if (result?.length > 0) {
              reject('EMAIL_EXISTED');
            } else {
              resolve(result);
            }
          }
        });
      });
    };

    if (this.validateEmailToken(token)) {
      const promise = () => {
        return new Promise((resolve, reject) => {
          const data = [email];
          db.query(`update user_auth_info set auth_email = ? where user_id = ${user_id}`, data, (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
        });
      };

      checkEmail()
        .then((result) => {
          return promise();
        })
        .then((result) => {
          res.status(200).send(result);
        })
        .catch((err) => {
          console.log(err);
          res.status(400).send(err);
        });
    } else {
      res.status(400).send('INVALID_TOKEN');
    }
  };
}

module.exports = new AuthController();
