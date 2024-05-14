const db = require('../../config/db');

class RoomController {
  // [GET] /rooms
  getRoomInfo(req, res) {
    const { room_id } = req.query;
    const user = req.userInfo;

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `SELECT * FROM rooms
        JOIN user_joins_room
        ON rooms.room_id = user_joins_room.room_id
        where rooms.room_id = ${room_id} and user_joins_room.user_id = ${user.user_id}`,
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              if (result.length === 0) {
                reject('USER DONT HAVE PERMISION!');
              } else {
                resolve(result);
              }
            }
          },
        );
      });
    };

    promise()
      .then((result) => {
        let roomInfo = result[0];
        return new Promise((resolve, reject) => {
          db.query(
            `SELECT users.* FROM user_joins_room, users
                  WHERE user_joins_room.room_id = ${room_id} AND users.user_id = user_joins_room.user_id AND (user_joins_room.joined_at > user_joins_room.left_at OR user_joins_room.left_at is null)`,
            (err, result) => {
              if (err) {
                reject(err);
              } else {
                roomInfo.members = result;
                resolve(roomInfo);
              }
            },
          );
        });
      })
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(404).send(err);
        console.log(err);
      });
  }

  // [GET] /users/get-users-in-room/:room_id
  getUsersOfRoom(req, res) {
    const room_id = req.query.room_id;
    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `SELECT users.*, rooms.admin_id FROM user_joins_room
          LEFT JOIN users
          ON users.user_id = user_joins_room.user_id
          LEFT JOIN rooms
          ON user_joins_room.room_id = rooms.room_id
            WHERE user_joins_room.room_id = ${room_id}
            AND (user_joins_room.joined_at > user_joins_room.left_at or user_joins_room.left_at is Null)`,
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

    room_id &&
      promise()
        .then((result) => {
          res.send(result);
        })
        .catch((err) => {
          console.log(err);
          res.send(err);
        });
  }

  // [POST] /rooms/create-new-room
  createRoom(req, res) {
    const roomInfo = req.body;
    const user = req.userInfo;
    const imgsrc = 'http://127.0.0.1:5000/room-avatars/' + req.file?.filename;
    const imgDefault = 'http://127.0.0.1:5000/images/avatardefault_92824.jpg';
    const promise = () =>
      new Promise((resolve, reject) => {
        db.query(
          `insert into rooms(room_name, room_avatar, created_at, room_type, admin_id) values ('${roomInfo.groupName}', ?, '${roomInfo.created_at}', 2, ${user.user_id})`,
          [req.file ? imgsrc : imgDefault],
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          },
        );
      });

    promise()
      .then((result) => {
        return new Promise((resolve, reject) => {
          const room_id = result.insertId;
          const members = JSON.parse(roomInfo.members);
          let values = members.map((member) => [member.user_id, room_id]);
          db.query(`insert into user_read_message(user_id, room_id) values ?`, [values], (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(room_id);
            }
          });
        });
      })
      .then((result) => {
        return new Promise((resolve, reject) => {
          const room_id = result;
          const members = JSON.parse(roomInfo.members);
          let query = 'insert into user_joins_room(user_id, room_id, joined_at) values ?';
          let values = members.map((member) => [member.user_id, room_id, roomInfo.created_at]);
          db.query(query, [values], (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(room_id);
            }
          });
        });
      })
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }

  // [POST] /rooms/set-admin/:user_id
  setAdmin(req, res) {
    const { authorizeduser_id, room_id } = req.body;
    const user_id = req.userInfo.user_id;

    const checkingPromise = () => {
      return new Promise((resolve, reject) => {
        db.query(`select * from rooms where room_id = ${room_id}`, (err, result) => {
          if (err) {
            reject(err);
          } else {
            if (result[0].room_type == 1) {
              reject('THIS IS NOT A ROOM');
            } else {
              resolve(true);
            }
          }
        });
      });
    };

    const promise = () =>
      new Promise((resolve, reject) => {
        db.query(
          `UPDATE rooms 
          SET admin_id = ${authorizeduser_id}
          WHERE room_id = ${room_id} AND (admin_id = ${user_id} OR admin_id is Null)`,
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              if (result.changedRows == 0) {
                reject('THERE IS NOTHING TO CHANGE');
              }
              resolve(result);
            }
          },
        );
      });

    checkingPromise()
      .then((result) => {
        return promise();
      })
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send(err);
      });
  }

  // [POST] /rooms/add-users/
  addUsers(req, res) {
    const { admin_id, members, room_id, joined_at } = req.body;
    let membersInfo = [];

    membersInfo = members.map((member) => {
      return { user_id: member.user_id, room_id, joined_at };
    });

    const checkingPromise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `SELECT * FROM rooms
          WHERE room_id = ${room_id} AND admin_id = ${admin_id} AND room_type = 2`,
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              if (result.length == 0) {
                reject('USER DONT HAVE PERMISION!');
              } else {
                resolve(addingUserPromise());
              }
            }
          },
        );
      });
    };

    const addingUserPromise = () => {
      const queryArr = membersInfo.map((member) => {
        return `SET @user_id = ${member.user_id},
        @room_id = ${member.room_id},
          @joined_at = '${member.joined_at}';
      INSERT INTO user_joins_room
          (user_id, room_id, joined_at)
      VALUES
          (@user_id, @room_id, @joined_at)
      ON DUPLICATE KEY UPDATE
        joined_at = @joined_at;`;
      });

      const queries = queryArr.join('');

      return new Promise((resolve, reject) => {
        db.query(queries, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    };

    checkingPromise()
      .then((result) => res.send(result))
      .catch((err) => {
        console.log(err);
      });
  }

  // [UPDATE] /rooms/change-info
  changeInfo(req, res) {
    const { room_id, room_name } = req.body;
    const user_id = req.userInfo.user_id;
    const imgsrc = 'http://127.0.0.1:5000/room-avatars/' + req.file?.filename;

    let check = 1;

    if (!req.file || !room_name) {
      check = 0;
    }

    const checkingPromise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `
        select * from user_joins_room
        where room_id = ${room_id} and user_id = ${user_id} and (left_at < joined_at or left_at is null)`,
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              if (result.length == 0) {
                reject(`YOU NO LONGER IN ROOM ${room_id}`);
              } else {
                resolve(result);
              }
            }
          },
        );
      });
    };

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `UPDATE rooms
            SET ${req.file?.filename ? `room_avatar = '${imgsrc}'` : ''}
                ${check ? ',' : ''}
                ${room_name ? `room_name = '${room_name}'` : ''}
            WHERE room_id = ${room_id}`,
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

    checkingPromise()
      .then((result) => {
        return promise();
      })
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // [DELETE] /rooms/delete/:room_id
  deleteChat(req, res) {
    const room_id = req.body.room_id;
    const deleted_at = req.body.deleted_at;
    const user = req.userInfo;

    const createNewRecordPromise = () =>
      new Promise((resolve, reject) => {
        db.query(
          `insert into deleted_chats(room_id, user_id, deleted_at) values(${room_id}, ${user.user_id}, '${deleted_at}')`,
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          },
        );
      });

    const checkingPromise = () =>
      new Promise((resolve, reject) => {
        db.query(
          `SELECT * FROM deleted_chats
        WHERE room_id = ${room_id} AND user_id = ${user.user_id} AND deleted_at is not Null`,
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              if (result.length === 0) {
                resolve(createNewRecordPromise());
              } else {
                resolve(updateRecordPromise());
              }
            }
          },
        );
      });

    const updateRecordPromise = () =>
      new Promise((resolve, reject) => {
        db.query(
          `UPDATE deleted_chats SET deleted_at = '${deleted_at}' WHERE user_id = ${user.user_id} and room_id = ${room_id}`,
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          },
        );
      });

    checkingPromise()
      .then((result) => res.send(result))
      .catch((err) => console.log(err));
  }

  // [DELETE] /rooms/remove-user/
  removeUser(req, res) {
    const { admin_id, room_id, deleteduser_id, left_at } = req.body;

    const checkingPromise = () => {
      return new Promise((resolve, reject) => {
        if (admin_id == deleteduser_id) {
          reject('ADMIN CANNOT LEAVE ROOM');
          return;
        }
        db.query(
          `SELECT * FROM rooms
          WHERE room_id = ${room_id} AND admin_id = ${admin_id} AND room_type = 2`,
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              if (result.length == 0) {
                reject('USER DONT HAVE PERMISION!');
              } else {
                resolve(true);
              }
            }
          },
        );
      });
    };

    const promise = () =>
      new Promise((resolve, reject) => {
        db.query(
          `UPDATE user_joins_room SET left_at = '${left_at}' WHERE user_id = ${deleteduser_id} and room_id = ${room_id}`,
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              if (result.changedRows == 0) {
                reject('THIS USER IS NOT IN THIS ROOM');
              } else {
                resolve(result);
              }
            }
          },
        );
      });

    checkingPromise()
      .then((result) => {
        return promise();
      })
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send(err);
      });
  }

  // [DELETE] /rooms/leave-room
  leaveRoom(req, res) {
    const { user_id, room_id, left_at } = req.body;

    const checkingPromise = () => {
      return new Promise((resolve, reject) => {
        db.query(`select * from rooms where room_id = ${room_id} and admin_id <> ${user_id}`, (err, result) => {
          if (err) {
            reject(err);
          } else {
            if (result[0]?.room_type == 1 || result.length == 0) {
              reject('THIS IS NOT A ROOM');
            } else {
              resolve(true);
            }
          }
        });
      });
    };

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `UPDATE user_joins_room SET left_at = '${left_at}' WHERE user_id = ${user_id} and room_id = ${room_id}`,
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

    checkingPromise()
      .then((result) => {
        return promise();
      })
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send(err);
      });
  }
}

module.exports = new RoomController();
