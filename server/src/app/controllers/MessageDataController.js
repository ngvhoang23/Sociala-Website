const db = require('../../config/db');
const uploadModel = require('../../models/uploadModel');
const { isImage, isVideo } = require('../../UserDefinedFunctions');
const { uploadFiles, deleteFiles } = require('../../models/uploadModel');
var moment = require('moment');

class MessageDataController {
  // [GET] /message-datas
  index(req, res) {
    const promise = new Promise((resolve, reject) => {
      db.query(`SELECT * FROM messages`, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    promise
      .then((data) => ['result'])
      .then((data) => res.send(data))
      .catch((err) => res.send(err));
  }

  // [GET] /message-datas/"contacts
  getContacts(req, res) {
    const user = req.userInfo;

    const promise = new Promise((resolve, reject) => {
      db.query(
        `WITH rm AS (
          SELECT messages.*, ROW_NUMBER()	OVER (PARTITION BY room_id ORDER BY created_at DESC) AS rn
          FROM messages, user_joins_room as ujr
          WHERE messages.room_id = ujr.room_id and ujr.user_id = ${user.user_id} and ((ujr.joined_at > ujr.left_at or (ujr.joined_at < ujr.left_at) and messages.created_at <= ujr.left_at) or ujr.left_at is Null)
        )
        SELECT rooms.*, rm.message_id, rm.message, rm.author_id, users.full_name as author_name, rm.created_at, rm.type, ujr.joined_at, ujr.left_at FROM rm
        RIGHT JOIN user_joins_room AS ujr
        ON rm.room_id = ujr.room_id
        LEFT JOIN users
        ON rm.author_id = users.user_id
        INNER JOIN rooms
        ON ujr.room_id = rooms.room_id
        LEFT JOIN deleted_chats
        ON rooms.room_id = deleted_chats.room_id AND deleted_chats.user_id = ${user.user_id}
        where (rm.rn = 1 OR rm.rn is Null) AND ujr.user_id = ${user.user_id}
          AND (deleted_chats.deleted_at < rm.created_at OR deleted_chats.deleted_at is Null) AND (rm.created_at is not null  OR (rm.created_at is null AND rooms.room_type =2))
          order by rm.created_at desc`,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        },
      );
    });

    promise
      .then((result) => {
        var contacts = result;
        return new Promise((resolve, reject) => {
          db.query(
            `SELECT ujr1.room_id, users.* FROM user_joins_room as ujr1, users
          WHERE ujr1.room_id in (
            SELECT ujr2.room_id FROM user_joins_room as ujr2
            WHERE ujr2.user_id = ${user.user_id}) AND ujr1.user_id = users.user_id`,
            (err, result) => {
              if (err) {
                reject(err);
              } else {
                // put members into each room
                const members = result;

                for (let i = 0; i < contacts.length; i++) {
                  contacts[i].members = [];
                  for (let j = 0; j < members.length; j++) {
                    if (contacts[i].room_id === members[j].room_id) {
                      contacts[i].members.push(members[j]);
                    }
                  }
                }
                resolve(contacts);
              }
            },
          );
        });
      })
      .then((result) => {
        const contacts = result;
        return new Promise((resolve, reject) => {
          db.query(
            `SELECT * FROM user_read_message
              WHERE room_id in (
                SELECT room_id FROM user_joins_room
                WHERE user_id = ${user.user_id}
              ) AND user_id = ${user.user_id}`,
            (err, result) => {
              if (err) {
                reject(err);
              } else {
                const lastSeenInfo = result;
                lastSeenInfo.forEach((room) => {
                  const ind = contacts.findIndex((contact) => contact.room_id == room.room_id);
                  if (ind != -1) {
                    if (new Date(contacts[ind].created_at) <= new Date(room.last_seen_at)) {
                      contacts[ind].isSeen = true;
                    } else {
                      if (contacts[ind].author_id === user.user_id) {
                        contacts[ind].isSeen = true;
                      } else {
                        contacts[ind].isSeen = false;
                      }
                    }
                  }
                });
                resolve(contacts);
              }
            },
          );
        });
      })
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => res.send('err'));
  }

  // [GET] /message-datas/:room_id
  getChatHistory(req, res) {
    const { room_id, last_seen_at, quantity } = req.query;
    const user = req.userInfo;

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `SELECT * FROM
          (
          SELECT messages.*, users.full_name, users.user_avatar AS author_avatar FROM messages
            LEFT JOIN deleted_chats
            ON messages.room_id = deleted_chats.room_id AND deleted_chats.user_id = ${user.user_id}
            INNER JOIN user_joins_room
            ON messages.room_id = user_joins_room.room_id AND user_joins_room.user_id = ${user.user_id}
            LEFT JOIN users
            ON messages.author_id = users.user_id
              WHERE messages.room_id = ${room_id}
              AND (deleted_chats.deleted_at < messages.created_at or deleted_chats.deleted_at is Null) 
              AND ((user_joins_room.joined_at < user_joins_room.left_at AND messages.created_at <= user_joins_room.left_at) OR user_joins_room.left_at is Null OR user_joins_room.joined_at > user_joins_room.left_at)
              ORDER BY messages.created_at DESC LIMIT ${quantity}
          ) AS sub
          ORDER BY created_at ASC; 
          SELECT user_read_message.room_id, user_read_message.last_seen_at, users.* FROM user_read_message, users
          WHERE user_read_message.room_id = ${room_id} AND user_read_message.user_id = users.user_id;
          SELECT user_remove_message.message_id FROM user_remove_message
          WHERE room_id = ${room_id} AND user_id = ${user.user_id}`,
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve({ content: result[0], lastSeenInfo: result[1], removeData: result[2] });
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

  // [GET] /message-datas/more-messages/:room_id
  getMoreMessages(req, res) {
    const { room_id, quantity, last_message_index } = req.query;
    const user = req.userInfo;

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `SELECT * FROM
          (
          SELECT messages.*, users.full_name, users.user_avatar AS author_avatar FROM messages
            LEFT JOIN deleted_chats
            ON messages.room_id = deleted_chats.room_id AND deleted_chats.user_id = ${user.user_id}
            INNER JOIN user_joins_room
            ON messages.room_id = user_joins_room.room_id AND user_joins_room.user_id = ${user.user_id}
            LEFT JOIN users
            ON messages.author_id = users.user_id
              WHERE messages.room_id = ${room_id}
              AND (deleted_chats.deleted_at < messages.created_at or deleted_chats.deleted_at is Null) 
              AND ((user_joins_room.joined_at < user_joins_room.left_at AND messages.created_at <= user_joins_room.left_at) OR user_joins_room.left_at is Null OR user_joins_room.joined_at > user_joins_room.left_at)
              AND message_index < ${last_message_index}
              ORDER BY messages.created_at DESC LIMIT ${quantity}
          ) AS sub
          ORDER BY created_at ASC;
          SELECT user_read_message.room_id, user_read_message.last_seen_at, users.* FROM user_read_message, users
          WHERE user_read_message.room_id = ${room_id} AND user_read_message.user_id = users.user_id;
          SELECT user_remove_message.message_id FROM user_remove_message
          WHERE room_id = ${room_id} AND user_id = ${user.user_id}`,
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve({ content: result[0], lastSeenInfo: result[1], removeData: result[2] });
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

  // [GET] /message-datas/media/:room_id
  getMedia(req, res) {
    const room_id = req.query.room_id;
    const user_id = req.userInfo.user_id;

    const checkingPromise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `
        select * from user_joins_room
        where user_id = ${user_id} and room_id = ${room_id} and (joined_at > left_at or left_at is null)
        `,
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              if (result.length <= 0) {
                reject('User do not have permision!');
              } else {
                resolve(result);
              }
            }
          },
        );
      });
    };

    const promise = () =>
      new Promise((resolve, reject) => {
        db.query(
          `
        select messages.message_id as media_id, messages.message as url, messages.room_id, messages.author_id, messages.created_at, messages.type from messages
        left join deleted_chats
        on (messages.room_id = deleted_chats.room_id and deleted_chats.user_id = ${user_id}) 
        where (messages.type = 'video' or messages.type = 'image') and messages.room_id = ${room_id} and (messages.created_at > deleted_chats.deleted_at OR deleted_chats.deleted_at is Null)
        and messages.message_id not in(select user_remove_message.message_id from user_remove_message where user_remove_message.user_id = ${user_id} and user_remove_message.room_id = ${room_id})
        ORDER BY messages.created_at DESC
        `,
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
      .then((result) => {
        return promise();
      })
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        console.log('err', err);
        res.send(err);
      });
  }

  // [GET] /message-datas/documents/:room_id
  getDocuments(req, res) {
    const room_id = req.query.room_id;
    const user = req.userInfo;
    const promise = new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM messages
        LEFT JOIN deleted_chats
        ON messages.room_id = deleted_chats.room_id AND deleted_chats.user_id = ${user.user_id}
          WHERE (messages.type = 'document') AND messages.room_id = ${room_id} AND (messages.created_at > deleted_chats.deleted_at OR deleted_chats.deleted_at is Null)
          ORDER BY messages.created_at DESC`,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        },
      );
    });

    promise
      .then((result) => {
        res.send(result);
      })
      .catch((err) => res.send(err));
  }

  // [GET] /message-datas/chat_boxes
  getChatBoxes(req, res) {
    const { room_ids } = req.query;
    const user_id = req.userInfo.user_id;

    const sql = room_ids
      .map((room_id) => {
        return `
          SELECT * FROM rooms
          JOIN user_joins_room
          ON rooms.room_id = user_joins_room.room_id
          WHERE rooms.room_id = ${room_id} and user_joins_room.user_id = ${user_id};
          SELECT * FROM users
          INNER JOIN user_joins_room
          ON users.user_id = user_joins_room.user_id
          WHERE (user_joins_room.joined_at > user_joins_room.left_at OR user_joins_room.left_at is null) and user_joins_room.room_id = ${room_id};
          SELECT * FROM
          (
          SELECT messages.*, users.full_name, users.user_avatar AS author_avatar FROM messages
            LEFT JOIN deleted_chats
            ON messages.room_id = deleted_chats.room_id AND deleted_chats.user_id = ${user_id}
            INNER JOIN user_joins_room
            ON messages.room_id = user_joins_room.room_id AND user_joins_room.user_id = ${user_id}
            LEFT JOIN users
            ON messages.author_id = users.user_id
              WHERE messages.room_id = ${room_id}
              AND (deleted_chats.deleted_at < messages.created_at or deleted_chats.deleted_at is Null) 
              AND ((user_joins_room.joined_at < user_joins_room.left_at AND messages.created_at <= user_joins_room.left_at) OR user_joins_room.left_at is Null OR user_joins_room.joined_at > user_joins_room.left_at)
              ORDER BY messages.created_at DESC LIMIT ${10}
          ) AS sub
          ORDER BY created_at ASC; 
          SELECT user_read_message.room_id, user_read_message.last_seen_at, users.* FROM user_read_message, users
          WHERE user_read_message.room_id = ${room_id} AND user_read_message.user_id = users.user_id;
          SELECT user_remove_message.message_id FROM user_remove_message
          WHERE room_id = ${room_id} AND user_id = ${user_id};
      `;
      })
      .join('');

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
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }

  // [POST] /message-datas
  async postMessages(req, res) {
    const messagePackage = JSON.parse(req.body.infoMessagePackage);
    const files = req.files;
    const messageTextData = req.body.messageTextData && JSON.parse(req.body.messageTextData);
    const user = req.userInfo;

    const promise = (data) => {
      return new Promise((resolve, reject) => {
        db.query(
          `INSERT INTO messages(message_id, room_id, author_id, message, mime_type, type, file_name, file_size, created_at) VALUES ?`,
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

    const checkingPromise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `SELECT * From user_joins_room
          where user_id = ${user.user_id} and room_id = ${messagePackage.room_id} and (left_at < joined_at or left_at is Null) `,
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              if (result.length == 0) {
                reject('USER NO LONGGER IN ROOM');
              } else {
                resolve(promise(messageValues));
              }
            }
          },
        );
      });
    };

    const messageValues = [];

    if (files.length > 0) {
      files.forEach((file) => {
        let url = 'http://127.0.0.1:5000/documents/' + file?.filename;
        let type = 'document';
        if (isImage(file.originalname)) {
          url = 'http://127.0.0.1:5000/images/' + file?.filename;
          type = 'image';
        } else if (isVideo(file.originalname)) {
          url = 'http://127.0.0.1:5000/videos/' + file?.filename;
          type = 'video';
        }

        messageValues.push([
          file.id,
          messagePackage.room_id,
          messagePackage.author.user_id,
          url,
          file.mimetype,
          type,
          file.originalname,
          file.size,
          moment().valueOf(),
        ]);
      });
    }
    if (messageTextData) {
      let formattedMessage = '';
      formattedMessage = messageTextData.messageText.replaceAll("'", "\\'"); // insted of \' due to prettier eslint
      messageValues.push([
        messageTextData.message_id,
        messagePackage.room_id,
        messagePackage.author.user_id,
        messageTextData.messageText,
        null,
        'text',
        null,
        null,
        moment().valueOf(),
      ]);
    }

    checkingPromise()
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }

  // [POST] /message-datas/notification/
  postNotification(req, res) {
    const { notifications } = req.body;

    let notificationData = [];

    notificationData = notifications.map((notification) => {
      return [notification.message_id, notification.room_id, notification.message, 'text', notification.created_at];
    });

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `INSERT INTO messages(message_id, room_id, message, type, created_at) VALUES ?`,
          [notificationData],
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
      .catch((err) => console.log(err));
  }

  // [GET] /message-datas/check-exist
  checkExistChat(req, res) {
    const user = req.userInfo;
    const queries = req.query;

    const promise = new Promise((resolve, reject) => {
      db.query(
        `SELECT rooms.* FROM user_joins_room as ujr1, rooms
        WHERE ujr1.room_id = rooms.room_id AND ujr1.room_id in (
          SELECT ujr2.room_id FROM user_joins_room as ujr2
          WHERE ujr2.user_id = ${user.user_id}) AND ujr1.user_id = ${queries.user_id} AND room_type = 1`,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        },
      );
    });

    promise
      .then((result) => {
        return new Promise((resolve, reject) => {
          if (result.length === 0) {
            db.query(`insert into rooms(created_at, room_type) values ('${moment().valueOf()}', 1)`, (err, result) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            });
          } else {
            reject({ room_id: result[0].room_id });
          }
        });
      })
      .then((result) => {
        return new Promise((resolve, reject) => {
          const room_id = result.insertId;
          let values = [
            [user.user_id, room_id],
            [queries.user_id, room_id],
          ];
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
          let query = 'insert into user_joins_room(user_id, room_id, joined_at) values ?';
          let values = [
            [user.user_id, room_id, `${moment().valueOf()}`],
            [queries.user_id, room_id, `${moment().valueOf()}`],
          ];
          db.query(query, [values], (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve({ room_id });
            }
          });
        });
      })
      .then((result) => res.send(result))
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }

  // [UPDATE] /message-datas/update-last-seen-message
  updateLastSeenMessage(req, res) {
    const { room_id, last_seen_at } = req.body;
    const user = req.userInfo;

    const promise = new Promise((resolve, reject) => {
      db.query(
        `replace into user_read_message (user_id, room_id, last_seen_at)
         values(${user.user_id}, ${room_id},'${last_seen_at}')`,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        },
      );
    });

    promise.then((result) => res.send(result)).catch((err) => res.send(err));
  }

  // [DELETE] /message-datas/remove/:message_id
  removeMessage(req, res) {
    const { message_id, room_id, users, user_id } = req.body;
    // check user in room
    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `SELECT * FROM user_joins_room
          WHERE room_id = ${room_id} AND user_id = ${user_id}`,
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              if (result.length !== 0) {
                resolve(result);
              } else {
                reject("user don't have permission");
              }
            }
          },
        );
      });
    };
    promise()
      .then((result) => {
        const data = users.map((user) => {
          return [user.user_id, message_id, room_id];
        });
        return new Promise((resolve, reject) => {
          db.query(`INSERT INTO user_remove_message(user_id, message_id, room_id) VALUES ?`, [data], (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
        });
      })
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }
}

module.exports = new MessageDataController();
