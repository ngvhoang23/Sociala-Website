const db = require('../../config/db');

class UserController {
  // [GET] /users/:slug
  getContactProfile(req, res) {
    const { profile_id } = req.query;
    const user_id = req.userInfo.user_id;

    if (!profile_id) {
      return;
    }

    const promise = (sql) => {
      return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    };

    const checkIsFriend = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `select * from friends where user_id=${profile_id} and friend_id=${user_id} and status=1`,
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              if (result.length <= 0) {
                resolve(0);
              } else {
                resolve(1);
              }
            }
          },
        );
      });
    };

    checkIsFriend()
      .then((result) => {
        let sql = ``;
        if (result === 0) {
          sql = `
        select u.user_id, u.full_name, u.user_avatar, u.background_image,
          case when p.phone_num = 'public' then u.phone_num else null end as phone_num,
          case when p.email_address = 'public' then u.email_address else null end as email_address,
          case when p.website = 'public' then u.website else null end as website,
          case when p.birth_date = 'public' then u.birth_date else null end as birth_date,
          case when p.address = 'public' then u.address else null end as address,
          case when p.gender = 'public' then u.gender else null end as gender,
          case when p.detail_about = 'public' then u.detail_about else null end as detail_about,
          case when p.another_name = 'public' then u.another_name else null end as another_name,
          case when p.favorite_quote = 'public' then u.favorite_quote else null end as favorite_quote,
          case when p.workplace = 'public' then u.workplace else null end as workplace,
          case when p.education = 'public' then u.education else null end as education
          from users u
          join user_info_privacy p on u.user_id = p.user_id
          where u.user_id = ${profile_id};
        select * from friends
          inner join users 
          on friends.friend_id = users.user_id
            where friends.user_id=${profile_id} and friends.status=1;
        select users.user_id, users.full_name from friends f1
          inner join users
          on f1.friend_id = users.user_id
          where f1.friend_id in(
            select f2.friend_id from friends f2
              where f2.user_id=${profile_id} and f2.status = 1
          ) and f1.status = 1 and f1.user_id=${user_id}
        `;
        } else if (result === 1) {
          sql = `
        select u.user_id, u.full_name, u.user_avatar, u.background_image,
          case when p.phone_num <> 'only_me' then u.phone_num else null end as phone_num,
          case when p.email_address <> 'only_me' then u.email_address else null end as email_address,
          case when p.website <> 'only_me' then u.website else null end as website,
          case when p.birth_date <> 'only_me' then u.birth_date else null end as birth_date,
          case when p.address <> 'only_me' then u.address else null end as address,
          case when p.gender <> 'only_me' then u.gender else null end as gender,
          case when p.detail_about <> 'only_me' then u.detail_about else null end as detail_about,
          case when p.another_name <> 'only_me' then u.another_name else null end as another_name,
          case when p.favorite_quote <> 'only_me' then u.favorite_quote else null end as favorite_quote,
          case when p.workplace <> 'only_me' then u.workplace else null end as workplace,
          case when p.education <> 'only_me' then u.education else null end as education
          from users u
          join user_info_privacy p on u.user_id = p.user_id
          where u.user_id = ${profile_id};
          select * from friends
          inner join users 
          on friends.friend_id = users.user_id
            where friends.user_id=${profile_id} and friends.status=1;
          select users.user_id, users.full_name from friends f1
            inner join users
            on f1.friend_id = users.user_id
            where f1.friend_id in(
              select f2.friend_id from friends f2
                where f2.user_id=${profile_id} and f2.status = 1
            ) and f1.status = 1 and f1.user_id=${user_id}
        `;
        }
        return promise(sql);
      })
      .then((result) => {
        const userPackage = {
          profile_info: result[0].length > 0 ? result[0][0] : undefined,
          friends: result[1],
          mutual_friends: result[2],
        };
        res.status(200).send(userPackage);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send(err);
      });
  }

  // [GET] /users/user-info/:token
  getUserInfo(req, res) {
    const { user_id } = req.userInfo;

    if (!user_id) {
      return;
    }

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `SELECT * FROM users 
          WHERE user_id = ${user_id}`,
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              if (result.length == 0) {
                resolve({});
              } else {
                resolve(result[0]);
              }
            }
          },
        );
      });
    };

    const getUserPrivacyInfo = () => {
      return new Promise((resolve, reject) => {
        db.query(`select * from user_info_privacy where user_id=${user_id}`, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result[0]);
          }
        });
      });
    };

    promise()
      .then((result) => {
        return getUserPrivacyInfo().then((privacy_info) => {
          return { user_info: result, privacy_info: privacy_info };
        });
      })
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send(err);
      });
  }

  // [GET] /users/suggested-users
  getSuggestedUsers(req, res) {
    db.query(`SELECT * FROM users`, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send(result);
      }
    });
  }

  // [GET] /users/search-users/
  getSearchedUsers(req, res) {
    const user_id = req.userInfo.user_id;
    const searchValue = req.query.searchValue;

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `SELECT * FROM users
        WHERE full_name LIKE ? and user_id <> ${user_id}`,
          [`%${searchValue}%`],
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          },
        );
      });
    };

    promise()
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  }

  // [PUT] /user/modify/:slug
  changeUserInfo(req, res) {
    const { user_id } = req.userInfo;
    const files = req.files;
    const { first_name, last_name, birth_date, gender } = req.body;

    const user_avatar = files?.user_avatar
      ? `http://127.0.0.1:5000/user-avatars/${files?.user_avatar[0].filename}`
      : undefined;
    const background_image = files?.background_image
      ? `http://127.0.0.1:5000/user-avatars/${files?.background_image[0].filename}`
      : undefined;

    const promise = () => {
      const sql = `update users set first_name = ? , last_name = ?, full_name = ?, gender = ?, birth_date = ?${
        user_avatar ? ', user_avatar = ?' : ''
      } ${background_image ? ', background_image = ?' : ''} where user_id = ${user_id}`;
      const data = [first_name, last_name, `${first_name} ${last_name}`, gender, birth_date];
      if (user_avatar) {
        data.push(user_avatar);
      }
      if (background_image) {
        data.push(background_image);
      }
      return new Promise((resolve, reject) => {
        db.query(sql, data, (err, result) => {
          if (err) {
            reject(err);
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
  }

  // [PUT] /users/:user_id/password/
  changePassword(req, res) {
    const {} = req.body;
    const user_id = req.userInfo;

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(``);
      });
    };
  }

  // [POST] /users/user-info
  insertUserInfo(req, res) {
    const { first_name, last_name, phone_num, gender, birth_date } = req.body;
    const { user_id, user_name } = req.userInfo;

    const promise = () => {
      return new Promise((resolve, reject) => {
        const data = [
          `${user_id}`,
          `${phone_num}`,
          `${gender}`,
          `${first_name}`,
          `${last_name}`,
          `${first_name} ${last_name}`,
          `http://127.0.0.1:5000/user-avatars/default_user_avatar.jpg`,
          `http://127.0.0.1:5000/user_background_images/defaultBG.jpeg`,
          birth_date,
        ];
        db.query(
          `insert users(user_id, phone_num, gender, first_name, last_name, full_name, user_avatar, background_image, birth_date) 
            values (?)`,
          [data],
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          },
        );
      });
    };

    const insertUserPrivacy = () => {
      return new Promise((resolve, reject) => {
        const data = [
          `${user_id}`,
          'public',
          'public',
          'public',
          'public',
          'public',
          'public',
          'public',
          'public',
          'public',
          'public',
          'public',
        ];
        db.query(
          `insert into user_info_privacy
          (user_id, 
            phone_num, 
            birth_date, 
            email_address, 
            website, 
            address, 
            gender, 
            detail_about,
            another_name,
            favorite_quote,
            workplace,
            education)
        values (?)`,
          [data],
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          },
        );
      });
    };

    promise()
      .then((result) => {
        return insertUserPrivacy();
      })
      .then((result) => {
        res.status(200).send({ message: 'Update User Information Successfully', result });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send({ message: 'Update User Information Failed', err });
      });
  }

  // [PUT] /users/user-info/contact-and-basic-info/:user_id
  updateUserContactAndBasicInfo(req, res) {
    const fields = req.body;
    const user_id = req.userInfo.user_id;

    let sql_setter = '';
    let sql_privacy_setter = '';
    const sql_values = [];
    const sql_privacy_values = [];

    for (const key in fields) {
      if (fields[key]?.content) {
        sql_privacy_setter += `${key}=?,`;
        sql_setter += `${key}=?,`;

        // Add values to the arrays for parameterized queries
        sql_values.push(fields[key].content);
        sql_privacy_values.push(fields[key].privacy);
      }
    }

    sql_setter = sql_setter.slice(0, -1);
    sql_privacy_setter = sql_privacy_setter.slice(0, -1);

    const sql = `UPDATE users SET ${sql_setter} WHERE user_id=?`;
    const sql_privacy = `UPDATE user_info_privacy SET ${sql_privacy_setter} WHERE user_id=?`;

    const promise = () => {
      return new Promise((resolve, reject) => {
        if (!sql_setter) {
          resolve({ message: 'Keep default value' });
          return;
        }

        // Add user_id to the array for parameterized queries
        sql_values.push(user_id);

        db.query(sql, sql_values, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      });
    };

    const updateUserPrivacy = () => {
      return new Promise((resolve, reject) => {
        if (!sql_privacy_setter) {
          resolve({ message: 'Keep default privacy' });
          return;
        }

        // Add user_id to the array for parameterized queries
        sql_privacy_values.push(user_id);

        db.query(sql_privacy, sql_privacy_values, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      });
    };

    promise()
      .then((result) => {
        return updateUserPrivacy();
      })
      .then((result) => {
        res.status(201).send(result);
      })
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  }

  // [DELETE] /users/user-info/contact-and-basic-info/:user_id
  deleteUserContactAndBasicInfo(req, res) {
    const { fields } = req.body;
    const user_id = req.userInfo.user_id;

    let sql_setter = '';

    fields.forEach((field) => {
      if (field) {
        sql_setter += `${field}=${null},`;
      }
    });

    sql_setter = sql_setter.slice(0, -1);

    if (!sql_setter) {
      res.status(400).send({ message: 'There is no payload sent' });
      return;
    }

    const sql = `
      update users set 
        ${sql_setter}
        where user_id=${user_id}
      `;

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(sql, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      });
    };

    promise()
      .then((result) => {
        res.status(201).send(result);
      })
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  }
}

module.exports = new UserController();
