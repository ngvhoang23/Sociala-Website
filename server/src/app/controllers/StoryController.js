const db = require('../../config/db');
const { isImage, isVideo } = require('../../UserDefinedFunctions');

class StoryController {
  // [GET] /stories/
  getStories(req, res) {
    const user_id = req.userInfo.user_id;

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `
          select stories.*, story_songs.song_id, story_songs.url as song_url, story_songs.song_name, story_songs.singer_name, story_songs.song_img_url, users.user_id as author_id, users.full_name as author_full_name, users.user_avatar as author_avatar, TIMESTAMPDIFF(HOUR, stories.created_at + INTERVAL 24 HOUR, CURRENT_TIMESTAMP()) AS remaining_time from stories
          inner join users
          on stories.author_id = users.user_id
          left join story_songs
          on story_songs.song_id = stories.attached_song_id
          where UNIX_TIMESTAMP(FROM_UNIXTIME(stories.created_at / 1000 + (24 * 3600))) - UNIX_TIMESTAMP(NOW()) > 0;
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

  // [GET] /story-songs
  getStorySongs(req, res) {
    const {} = req.body;
    const user_id = req.userInfo.user_id;

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(`select * from story_songs`, (err, result) => {
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
        res.status(400).send(err);
      });
  }

  // [GET] /seen-stories/
  getSeenStories(req, res) {
    const {} = req.body;
    const user_id = req.userInfo.user_id;

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `
        select seen_stories.* from seen_stories
        inner join stories
        on seen_stories.story_id = stories.story_id
        where UNIX_TIMESTAMP(FROM_UNIXTIME(stories.created_at / 1000 + (24 * 3600))) - UNIX_TIMESTAMP(NOW()) > 0 and user_id = ${user_id}
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

  // [POST] /seen-stories
  insertSeenStory(req, res) {
    const { story_id, created_at } = req.body;

    const user_id = req.userInfo.user_id;

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `replace into seen_stories(user_id, story_id, created_at) values(${user_id}, ${story_id}, '${created_at}')`,
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
      .catch((err) => {
        console.log(err);
        res.status(400).send(err);
      });
  }

  // [POST] /stories/
  postStory(req, res) {
    const user_id = req.userInfo.user_id;
    const { created_at, attached_song_id = null, duration = 5 } = req.body;
    const files = req.files;
    let url = 'http://127.0.0.1:5000/stories/' + files[0]?.filename;
    const thumbnail_url = 'http://127.0.0.1:5000/stories/' + files[1]?.filename;
    let story_type = 'image';
    if (isVideo(files[0].originalname)) {
      story_type = 'video';
    }

    let data = [user_id, url, thumbnail_url, story_type, created_at];

    let sql = `insert into stories(author_id, content, thumbnail, story_type, created_at) values(?)`;

    if (story_type == 'image') {
      sql = `insert into stories(author_id, content, thumbnail, story_type, duration, attached_song_id, created_at) values(?)`;
      data = [`${user_id}`, `${url}`, `${thumbnail_url}`, `${story_type}`, duration, attached_song_id, `${created_at}`];
    }

    console.log(data);

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(sql, [data], (err, result) => {
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
        res.status(400).send(err);
      });
  }

  // [DELETE] /stories/:story_id
  deleteStory(req, res) {
    const { story_id } = req.body;
    const user_id = req.userInfo.user_id;

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(`delete from stories where story_id=${story_id} and author_id=${user_id}`, (err, result) => {
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
}

module.exports = new StoryController();
