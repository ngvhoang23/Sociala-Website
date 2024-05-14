const db = require('../../config/db');
const moment = require('moment');

class notificationsController {
  // [GET] /notifications/:user-id
  getNotifications(req, res) {
    const user_id = req.userInfo.user_id;

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `select notifications.*, defined_notifications.noti_code, users.full_name as sender_name, users.user_avatar as sender_avatar from notifications
          inner join defined_notifications
          on notifications.defined_noti_id = defined_notifications.noti_id
          inner join users on notifications.user_id = users.user_id
          where notifications.target_user_id = ${user_id}
          order by notifications.created_at desc`,
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
      .catch((error) => {
        console.log(error);
        res.send(error);
      });
  }

  // [POST] /notifications/single-noti
  postNotification(req, res) {
    const { target_user_id, user_id, defined_noti_id, post_id, created_at } = req.body;

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `REPLACE INTO notifications(user_id, target_user_id, is_read, defined_noti_id, post_id, created_at) VALUES (${user_id}, ${target_user_id}, ${false}, '${defined_noti_id}', ${
            post_id || null
          }, '${created_at}')`,
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
        console.log(err);
        res.status(400).send(err);
      });
  }

  // [POST] /notifications/multiple-noti
  postNotifications(req, res) {
    const { user_id, target_user_ids, defined_noti_id, post_id, created_at } = req.body;

    const values = [];

    target_user_ids.forEach((target_user_id) => {
      values.push([user_id, target_user_id, 0, defined_noti_id, post_id, `${created_at}`]);
    });

    if (target_user_ids?.length === 0) {
      res.status(200).send('no friends to send notifications');
      return;
    }

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `replace into notifications(user_id, target_user_id, is_read, defined_noti_id, post_id, created_at) values ?`,
          [values],
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
        res.status(400).send(err);
      });
  }

  // [UPDATE] /notifications/is-read
  updateIsRead(req, res) {
    const { user_id, target_user_id, defined_noti_id, is_read } = req.body;

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `update notifications set is_read = ${is_read} 
          where user_id=${user_id} and target_user_id=${target_user_id} and defined_noti_id='${defined_noti_id}'`,
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

  // [DELETE] /notifications/:noti_id
  deleteNotification(req, res) {
    const { user_id, target_user_id, defined_noti_id } = req.body;

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `delete from notifications
        where user_id=${user_id} and target_user_id=${target_user_id} and defined_noti_id='${defined_noti_id}'`,
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
        res.status(400).send(err);
      });
  }

  // [DELETE] /notifications/:user_id1/:user_id2
  deleteNotifications(req, res) {
    const { user_id1, user_id2 } = req.body;

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `delete from notifications
          where (user_id=${user_id1} and target_user_id=${user_id2}) or (user_id=${user_id2} and target_user_id=${user_id1})`,
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
        res.status(400).send(err);
      });
  }
}

module.exports = new notificationsController();
