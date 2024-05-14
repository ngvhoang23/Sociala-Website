const db = require('../../config/db');
const moment = require('moment');

class FriendController {
  // [GET] /users/friends/:user_id
  getFriends(req, res) {
    const { queried_user_id } = req.query;
    const user_id = req.userInfo.user_id;

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `select users.*, friends.created_at from friends
        inner join users
        on friends.friend_id = users.user_id
        where friends.user_id = ${queried_user_id} and friends.status = 1`,
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
        res.send(result);
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }

  // [GET] /users/friends/:user_id
  searchFriends(req, res) {
    const { search_value } = req.query;
    const { queried_user_id } = req.query;
    const user_id = req.userInfo.user_id;

    const promise = () => {
      return new Promise((resolve, reject) => {
        const data = [`${queried_user_id}`, `%${search_value}%`];
        db.query(
          `select users.*, friends.created_at from friends
          inner join users
          on friends.friend_id = users.user_id
          where friends.user_id = ? and friends.status = 1 and users.full_name like ?`,
          data,
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
        res.send(result);
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }

  // [GET] /users/friends/friend-requests/:user_id
  getFriendRequest(req, res) {
    const user_id = req.userInfo.user_id;

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `select users.*, friends.created_at from friends
        inner join users
        on friends.user_id = users.user_id
        where friends.friend_id = ${user_id} and friends.status = 0`,
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
        res.send(result);
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }

  // [GET] /users/friends/sent-friend-requests/:user_id
  getSentFriendRequest(req, res) {
    const user_id = req.userInfo.user_id;
    const { queried_user_id } = req.query;

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `select users.*, friends.created_at from friends
          inner join users
          on friends.friend_id = users.user_id
          where friends.user_id = ${queried_user_id} and friends.status = 0`,
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
        res.send(result);
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }

  // [GET] /users/friends/relationship/:user_id
  getRelationship(req, res) {
    const user_id = req.userInfo.user_id;

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `select users.user_id as guest_id, users.user_avatar, users.full_name, friends.* from friends
          inner join users
          on friends.friend_id = users.user_id or friends.user_id = users.user_id
          where ((friends.user_id = ${user_id} and users.user_id <> ${user_id}) or (friends.friend_id = ${user_id} and users.user_id <> ${user_id})) and status <> 1
          union
          select users.user_id, users.user_avatar, users.full_name, friends.* from friends
                    inner join users
                    on friends.friend_id = users.user_id
                    where ((friends.user_id = ${user_id})) and status = 1`,
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
        res.send(result);
      })
      .catch((err) => res.send(err));
  }

  // [GET] /users/mutual-friends/:user_id
  getMutualFriends(req, res) {
    const { user_id: user_id1 } = req.userInfo;
    const { user_id: user_id2 } = req.query;

    const sql = `
    select users.user_id, users.full_name, users.full_name, users.user_avatar, users.created_at from 
    (select * from friends where friends.user_id = ${user_id1} and friends.status = 1) user1
    inner join 
    (select * from friends where friends.user_id = ${user_id2} and friends.status = 1) user2
    on user1.friend_id = user2.friend_id
    inner join users
    on user1.friend_id = users.user_id`;

    const promise = () => {
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

    promise()
      .then((result) => res.send(result))
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }

  //[POST] /users/friend-req
  postFriendReq(req, res) {
    const { friendId } = req.body;
    const user_id = req.userInfo.user_id;

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `insert into friends(user_id, friend_id, created_at, status) values(${user_id}, ${friendId}, '${moment().valueOf()}', ${0})`,
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
      .then((result) => res.send(result))
      .catch((error) => {
        console.log(error);
        res.send(error);
      });
  }

  //[DELETE] /users/friend-req
  removeFriendReq(req, res) {
    const { friendId } = req.body;
    const user_id = req.userInfo.user_id;

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `delete from friends where user_id = ${user_id} and friend_id = ${friendId} and status = 0`,
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
      .then((result) => res.send(result))
      .catch((error) => {
        console.log(error);
        res.send(error);
      });
  }

  //[PUT] /users/friend-req
  responseFriendReq(req, res) {
    const { friendId, status } = req.body;
    const user_id = req.userInfo.user_id;

    let sql = '';

    if (status == 1) {
      sql = `replace into friends(user_id, friend_id, created_at, status)
           values(${user_id}, ${friendId}, '${moment().valueOf()}', 1);
           replace into friends(user_id, friend_id, created_at, status)
           values(${friendId}, ${user_id}, '${moment().valueOf()}', 1)`;
    } else if (status == -1) {
      sql = `delete from friends where user_id = ${friendId} and friend_id = ${user_id} and status = 0`;
    }

    const promise = () => {
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

    promise()
      .then((result) => res.send(result))
      .catch((error) => {
        console.log(error);
        res.send(error);
      });
  }

  //[DELETE] /users/friends/:friendId
  unFriend(req, res) {
    const { friendId } = req.body;
    const user_id = req.userInfo.user_id;

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `delete from friends where user_id = ${friendId} and friend_id = ${user_id} and status = 1;
          delete from friends where user_id = ${user_id} and friend_id = ${friendId} and status = 1`,
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
      .then((result) => res.send(result))
      .catch((error) => {
        console.log(error);
        res.send(error);
      });
  }
}

module.exports = new FriendController();
