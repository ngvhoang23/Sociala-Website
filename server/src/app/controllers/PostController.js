const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../config/db');
const { isImage, isVideo } = require('../../UserDefinedFunctions');

class PostController {
  // [GET] /posts
  getPosts(req, res) {
    const { quantity, last_post_index } = req.query;

    const user_id = req.userInfo.user_id;

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `select posts.*, users.full_name as author_full_name, users.user_avatar as author_avatar from posts
          inner join users
          on posts.author_id = users.user_id
          where posts.ref_post_id is null and posts.post_id < ${last_post_index}
          order by posts.created_at desc limit ${quantity};
          select * from post_reactions 
          where post_reactions.post_id in (
            select posts.post_id from posts
                    inner join users
                    on posts.author_id = users.user_id
          ) and post_reactions.user_id = ${user_id};
          select post_id, count(*) as count from post_comments
          group by post_id;
          select post_id, type, count(*) as count from post_reactions
          group by post_id, type;
           select * from post_files;`,
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve({
                posts: result[0],
                reacted_posts_by_user_id: result[1],
                comments: result[2],
                reactions: result[3],
                files: result[4],
              });
            }
          },
        );
      });
    };

    promise()
      .then((result) => {
        const { posts, reacted_posts_by_user_id, comments, reactions, files } = result;
        posts.forEach((post) => {
          post.reaction_quantity = 0;
          post.files = [];

          reacted_posts_by_user_id.forEach((react_item) => {
            if (post.post_id == react_item.post_id) {
              post.is_reacted = true;
              post.react_type = react_item.type;
              post.reacted_at = react_item.created_at;
            }
          });

          comments.forEach((comment) => {
            if (comment.post_id == post.post_id) {
              post.comment_quantity = comment.count;
            }
          });
          post.reaction_info = [];
          reactions.forEach((reaction) => {
            if (reaction.post_id == post.post_id) {
              if (reaction.type == 'like') {
                post.reaction_quantity += reaction.count;
                post.reaction_info.push({ type: 'like', quantity: reaction.count });
              } else if (reaction.type == 'love') {
                post.reaction_quantity += reaction.count;
                post.reaction_info.push({ type: 'love', quantity: reaction.count });
              } else if (reaction.type == 'sad') {
                post.reaction_quantity += reaction.count;
                post.reaction_info.push({ type: 'sad', quantity: reaction.count });
              } else if (reaction.type == 'haha') {
                post.reaction_quantity += reaction.count;
                post.reaction_info.push({ type: 'haha', quantity: reaction.count });
              } else if (reaction.type == 'angry') {
                post.reaction_quantity += reaction.count;
                post.reaction_info.push({ type: 'angry', quantity: reaction.count });
              } else if (reaction.type == 'wow') {
                post.reaction_quantity += reaction.count;
                post.reaction_info.push({ type: 'wow', quantity: reaction.count });
              }
            }
          });

          files.forEach((file) => {
            if (file.post_id == post.post_id) {
              post.files.push({
                url: file.file_url,
                type: file.type,
                file_id: file.file_id,
                file_name: file.file_name,
                file_size: file.file_size,
              });
            }
          });
        });
        res.send(posts);
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }

  // [GET] /posts/your-posts
  getYourPosts(req, res) {
    const {} = req.body;
    const user_id = req.userInfo.user_id;

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `select posts.*, users.full_name as author_full_name, users.user_avatar as author_avatar from posts
              inner join users
              on posts.author_id = users.user_id
              where posts.ref_post_id is null and posts.author_id = ${user_id}
              order by posts.created_at desc;
              select * from post_reactions 
              where post_reactions.post_id in (
              select posts.post_id from posts
                  inner join users
                  on posts.author_id = users.user_id
                        where posts.author_id = ${user_id}
              ) and post_reactions.user_id = ${user_id};
              select post_id, count(*) as count from post_comments
              where post_comments.post_id in (
                select posts.post_id from posts
                  inner join users
                  on posts.author_id = users.user_id
                        where posts.author_id = ${user_id}
              )
              group by post_id;
              select post_id, type, count(*) as count from post_reactions
              where post_reactions.post_id in (
                select posts.post_id from posts
                  inner join users
                  on posts.author_id = users.user_id
                        where posts.author_id = ${user_id}
              )
              group by post_id, type;
              select * from post_files
              where post_files.post_id in (
                select posts.post_id from posts
                  inner join users
                  on posts.author_id = users.user_id
                        where posts.author_id = ${user_id}
              )`,
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve({
                posts: result[0],
                reacted_posts_by_user_id: result[1],
                comments: result[2],
                reactions: result[3],
                files: result[4],
              });
            }
          },
        );
      });
    };

    promise()
      .then((result) => {
        const { posts, reacted_posts_by_user_id, comments, reactions, files } = result;
        posts.forEach((post) => {
          post.reaction_quantity = 0;
          post.files = [];

          reacted_posts_by_user_id.forEach((react_item) => {
            if (post.post_id == react_item.post_id) {
              post.is_reacted = true;
              post.react_type = react_item.type;
              post.reacted_at = react_item.created_at;
            }
          });

          comments.forEach((comment) => {
            if (comment.post_id == post.post_id) {
              post.comment_quantity = comment.count;
            }
          });
          post.reaction_info = [];
          reactions.forEach((reaction) => {
            if (reaction.post_id == post.post_id) {
              if (reaction.type == 'like') {
                post.reaction_quantity += reaction.count;
                post.reaction_info.push({ type: 'like', quantity: reaction.count });
              } else if (reaction.type == 'love') {
                post.reaction_quantity += reaction.count;
                post.reaction_info.push({ type: 'love', quantity: reaction.count });
              } else if (reaction.type == 'sad') {
                post.reaction_quantity += reaction.count;
                post.reaction_info.push({ type: 'sad', quantity: reaction.count });
              } else if (reaction.type == 'haha') {
                post.reaction_quantity += reaction.count;
                post.reaction_info.push({ type: 'haha', quantity: reaction.count });
              } else if (reaction.type == 'angry') {
                post.reaction_quantity += reaction.count;
                post.reaction_info.push({ type: 'angry', quantity: reaction.count });
              } else if (reaction.type == 'wow') {
                post.reaction_quantity += reaction.count;
                post.reaction_info.push({ type: 'wow', quantity: reaction.count });
              }
            }
          });

          files.forEach((file) => {
            if (file.post_id == post.post_id) {
              post.files.push({
                url: file.file_url,
                type: file.type,
                file_id: file.file_id,
                file_name: file.file_name,
                file_size: file.file_size,
              });
            }
          });
        });
        res.send(posts);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send(err);
      });
  }

  // [GET] /posts/invidual-posts/:profile_id
  getInvidualPosts(req, res) {
    const { profile_id } = req.query;

    if (!profile_id) {
      console.log('profile_id is undefined');
      return;
    }

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `select posts.*, users.full_name as author_full_name, users.user_avatar as author_avatar from posts
              inner join users
              on posts.author_id = users.user_id
              where posts.ref_post_id is null and posts.author_id = ${profile_id}
              order by posts.created_at desc;
              select * from post_reactions 
              where post_reactions.post_id in (
              select posts.post_id from posts
                  inner join users
                  on posts.author_id = users.user_id
                        where posts.author_id = ${profile_id}
              ) and post_reactions.user_id = ${profile_id};
              select post_id, count(*) as count from post_comments
              where post_comments.post_id in (
                select posts.post_id from posts
                  inner join users
                  on posts.author_id = users.user_id
                        where posts.author_id = ${profile_id}
              )
              group by post_id;
              select post_id, type, count(*) as count from post_reactions
              where post_reactions.post_id in (
                select posts.post_id from posts
                  inner join users
                  on posts.author_id = users.user_id
                        where posts.author_id = ${profile_id}
              )
              group by post_id, type;
              select * from post_files
              where post_files.post_id in (
                select posts.post_id from posts
                  inner join users
                  on posts.author_id = users.user_id
                        where posts.author_id = ${profile_id}
              )`,
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve({
                posts: result[0],
                reacted_posts_by_user_id: result[1],
                comments: result[2],
                reactions: result[3],
                files: result[4],
              });
            }
          },
        );
      });
    };

    promise()
      .then((result) => {
        const { posts, reacted_posts_by_user_id, comments, reactions, files } = result;
        posts.forEach((post) => {
          post.reaction_quantity = 0;
          post.files = [];

          reacted_posts_by_user_id.forEach((react_item) => {
            if (post.post_id == react_item.post_id) {
              post.is_reacted = true;
              post.react_type = react_item.type;
              post.reacted_at = react_item.created_at;
            }
          });

          comments.forEach((comment) => {
            if (comment.post_id == post.post_id) {
              post.comment_quantity = comment.count;
            }
          });
          post.reaction_info = [];
          reactions.forEach((reaction) => {
            if (reaction.post_id == post.post_id) {
              if (reaction.type == 'like') {
                post.reaction_quantity += reaction.count;
                post.reaction_info.push({ type: 'like', quantity: reaction.count });
              } else if (reaction.type == 'love') {
                post.reaction_quantity += reaction.count;
                post.reaction_info.push({ type: 'love', quantity: reaction.count });
              } else if (reaction.type == 'sad') {
                post.reaction_quantity += reaction.count;
                post.reaction_info.push({ type: 'sad', quantity: reaction.count });
              } else if (reaction.type == 'haha') {
                post.reaction_quantity += reaction.count;
                post.reaction_info.push({ type: 'haha', quantity: reaction.count });
              } else if (reaction.type == 'angry') {
                post.reaction_quantity += reaction.count;
                post.reaction_info.push({ type: 'angry', quantity: reaction.count });
              } else if (reaction.type == 'wow') {
                post.reaction_quantity += reaction.count;
                post.reaction_info.push({ type: 'wow', quantity: reaction.count });
              }
            }
          });

          files.forEach((file) => {
            if (file.post_id == post.post_id) {
              post.files.push({
                url: file.file_url,
                type: file.type,
                file_id: file.file_id,
                file_name: file.file_name,
                file_size: file.file_size,
              });
            }
          });
        });
        res.send(posts);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send(err);
      });
  }

  // [GET] /posts/:post_id
  getPost(req, res) {
    const { queried_user_id, post_id } = req.query;
    const user_id = req.userInfo.user_id;

    if (!post_id || !queried_user_id) {
      console.log('post_id or queried_user_id is undefined');
      return;
    }

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `select posts.*, users.full_name as author_full_name, users.user_avatar as author_avatar from posts
          inner join users
          on posts.author_id = users.user_id
          where posts.post_id = ${post_id};
          select * from post_reactions 
          where post_reactions.post_id in (
          select posts.post_id from posts
              inner join users
              on posts.author_id = users.user_id
          ) and post_reactions.user_id = ${queried_user_id};
          select post_id, count(*) as count from post_comments
            where post_id = ${post_id}
          group by post_id;
          select post_id, type, count(*) as count from post_reactions
          where post_id = ${post_id}
          group by post_id, type;
          select * from post_files
          where post_id = ${post_id};`,
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve({
                post: result[0][0],
                reacted_posts_by_user_id: result[1],
                comments: result[2][0],
                reactions: result[3],
                files: result[4],
              });
            }
          },
        );
      });
    };

    promise()
      .then((result) => {
        const { post, reacted_posts_by_user_id, comments, reactions, files } = result;

        if (!post) {
          res.send(undefined);
          return;
        }

        post.reaction_quantity = 0;
        post.files = [];

        reacted_posts_by_user_id?.forEach((react_item) => {
          if (post.post_id == react_item.post_id) {
            post.is_reacted = true;
            post.react_type = react_item.type;
            post.reacted_at = react_item.created_at;
          }
        });

        post.comment_quantity = comments?.count || 0;

        post.reaction_info = [];

        reactions?.forEach((reaction) => {
          if (reaction.type == 'like') {
            post.reaction_quantity += reaction.count;
            post.reaction_info.push({ type: 'like', quantity: reaction.count });
          } else if (reaction.type == 'love') {
            post.reaction_quantity += reaction.count;
            post.reaction_info.push({ type: 'love', quantity: reaction.count });
          } else if (reaction.type == 'sad') {
            post.reaction_quantity += reaction.count;
            post.reaction_info.push({ type: 'sad', quantity: reaction.count });
          } else if (reaction.type == 'haha') {
            post.reaction_quantity += reaction.count;
            post.reaction_info.push({ type: 'haha', quantity: reaction.count });
          } else if (reaction.type == 'angry') {
            post.reaction_quantity += reaction.count;
            post.reaction_info.push({ type: 'angry', quantity: reaction.count });
          } else if (reaction.type == 'wow') {
            post.reaction_quantity += reaction.count;
            post.reaction_info.push({ type: 'wow', quantity: reaction.count });
          }
        });

        files?.forEach((file) => {
          post.files.push({
            url: file.file_url,
            type: file.type,
            file_id: file.file_id,
            file_name: file.file_name,
            file_size: file.file_size,
          });
        });

        res.send(post);
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }

  // [GET] /posts/reactions/:post_id
  getReactionsOfPost(req, res) {
    const { post_id } = req.query;
    const user_id = req.userInfo.user_id;

    if (!post_id) {
      console.log('post_id is undefined');
      return;
    }

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `
          select post_reactions.*, users.full_name, users.user_avatar from post_reactions
          inner join users
          on users.user_id = post_reactions.user_id
          where post_id = ${post_id}
          limit 10;
          select count(*) as count from post_reactions
          where post_id = ${post_id};
          select post_reactions.*, users.full_name, users.user_avatar from post_reactions
          inner join users
          on users.user_id = post_reactions.user_id
          where post_id = ${post_id}
        `,
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve({
                top10_recently_reactions: result[0],
                number_of_reactions: result[1][0].count,
                reactions: result[2],
              });
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

  // [GET] /posts/reaction-types/:post_id
  getReactionByType(req, res) {
    const { post_id, reaction_type } = req.query;
    const user_id = req.userInfo.user_id;

    if (!post_id || !reaction_type) {
      console.log('post_id or reaction_type is undefined');
      return;
    }

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `       
        select post_reactions.*, users.full_name from post_reactions
        inner join users
        on users.user_id = post_reactions.user_id
        where post_id = ${post_id} and post_reactions.type = '${reaction_type}'
        limit 10;
        select count(*) from post_reactions
        where post_id = ${post_id} and type = '${reaction_type}'`,
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve({ top10_reaction_of_user: result[0], number_of_reactions: result[1][0].count });
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

  // [GET] /posts/user-commentings/:post_id
  getUserCommentings(req, res) {
    const { post_id } = req.query;
    const user_id = req.userInfo.user_id;

    if (!post_id) {
      console.log('post_id is undefined');
      return;
    }

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `
          with tmp as (
            select post_id, user_id, count(*) as count from post_comments
            where post_id = ${post_id}
            group by post_id, user_id
          )
          select users.user_id, users.full_name, tmp.count from tmp
          inner join users
          on tmp.user_id = users.user_id
          limit 10;
          with tmp as (
            select post_id, user_id, count(*) as count from post_comments
            where post_id = ${post_id}
            group by post_id, user_id
          )
          select count(*) as count from tmp
          inner join users
          on tmp.user_id = users.user_id;
        `,
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve({ top10_recently_user_commenting: result[0], number_of_comments: result[1][0].count });
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

  // [GET] /posts/photos
  getPhotos(req, res) {
    const { queried_user_id } = req.query;

    if (!queried_user_id) {
      console.log('queried_user_id is undefined');
      return;
    }

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `
        select post_files.* from post_files
        inner join posts
        on post_files.post_id = posts.post_id
        where author_id = ${queried_user_id} and post_files.type = 'image'
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
      .then((result) => res.send(result))
      .catch((err) => {
        console.log(err);
        res.status(400).send(err);
      });
  }

  // [POST] /posts
  postPost(req, res) {
    const author_id = req.userInfo.user_id;
    const { text_content, created_at } = req.body;
    const files = req.files;

    const promise = () => {
      return new Promise((resolve, reject) => {
        const data = [`${author_id}`, `${text_content}`, `${created_at}`];
        db.query(
          `insert into posts(author_id, text_content, created_at) 
          values(?)`,
          [data],
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result.insertId);
            }
          },
        );
      });
    };

    const generateFilePackages = (post_id) => {
      let filePackages = [];

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

        filePackages.push([post_id, url, type, file.originalname, file.size]);
      });

      return filePackages.length > 0 ? filePackages : undefined;
    };

    const insertFile = (filePackages, inserted_post_id) => {
      return new Promise((resolve, reject) => {
        if (!filePackages) {
          resolve({ inserted_post_id });
        }
        db.query(
          `insert into post_files(post_id, file_url, type, file_name, file_size) 
          values ?`,
          [filePackages],
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve({ inserted_post_id });
            }
          },
        );
      });
    };

    promise()
      .then((result) => {
        const filePackages = generateFilePackages(result);
        return insertFile(filePackages, result);
      })
      .then((result) => {
        res.send(JSON.stringify(result));
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }

  // [DELETE] /posts/:post_id
  deletePost(req, res) {
    const { post_id } = req.body;
    const user_id = req.userInfo.user_id;

    if (!post_id) {
      console.log('post_id is undefined');
      return;
    }

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(`delete from posts where post_id = ${post_id} and author_id = ${user_id}`, (err, result) => {
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

  // [PATCH] /posts/:post_id
  editPost(req, res) {
    const author_id = req.userInfo.user_id;
    const { text_content, post_id, rest_files } = req.body;
    const new_files = req.files;
    let _rest_files = JSON.parse(rest_files);

    const checkingPromise = () => {
      return new Promise((resolve, reject) => {
        db.query(`select * from posts where post_id = ${post_id} and author_id = ${author_id}`, (err, result) => {
          if (err) {
            reject(err);
          } else {
            if (result.length == 0) {
              reject('You do not have permision!');
            } else {
              resolve(result);
            }
          }
        });
      });
    };

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `update posts set text_content = '${text_content}'
            where post_id = ${post_id} and author_id = ${author_id}`,
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

    const generateFilePackages = (post_id) => {
      let filePackages = [];

      new_files.forEach((file) => {
        let url = 'http://127.0.0.1:5000/documents/' + file?.filename;
        let type = 'document';
        if (isImage(file.originalname)) {
          url = 'http://127.0.0.1:5000/images/' + file?.filename;
          type = 'image';
        } else if (isVideo(file.originalname)) {
          url = 'http://127.0.0.1:5000/videos/' + file?.filename;
          type = 'video';
        }

        filePackages.push([post_id, url, type, file.originalname, file.size]);
      });

      _rest_files?.forEach((file) => {
        filePackages.push([post_id, file.url, file.type, file.file_name, file.file_size]);
      });

      return filePackages.length > 0 ? filePackages : undefined;
    };

    const deleteFile = (post_id) => {
      return new Promise((resolve, reject) => {
        db.query(`delete from post_files where post_id = ${post_id}`, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    };

    const insertFile = (filePackages) => {
      return new Promise((resolve, reject) => {
        if (filePackages) {
          db.query(
            `insert into post_files(post_id, file_url, type, file_name, file_size) 
            values ?`,
            [filePackages],
            (err, result) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            },
          );
        } else {
          resolve();
        }
      });
    };

    checkingPromise()
      .then((result) => {
        return promise();
      })
      .then((result) => {
        return deleteFile(post_id);
      })
      .then((result) => {
        const filePackages = generateFilePackages(post_id);
        return insertFile(filePackages);
      })
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }

  // [POST] /posts/comments/:post_id
  postComment(req, res) {
    const user_id = req.userInfo.user_id;
    const { post_id, text_content, created_at } = req.body;
    const file = req.file;

    if (!post_id) {
      console.log('post_id is undefined');
      return;
    }

    const comment_arr = [];
    if (text_content) {
      comment_arr.push([post_id, user_id, text_content, created_at, 'text', false]);
    }
    if (file) {
      let url = 'http://127.0.0.1:5000/videos/' + file?.filename;
      let type = 'video';
      if (isImage(file.originalname)) {
        url = 'http://127.0.0.1:5000/images/' + file?.filename;
        type = 'image';
      }
      comment_arr.push([post_id, user_id, url, created_at, type, false]);
    }

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `insert into post_comments(post_id, user_id, content, created_at, type, is_edited) 
            values ?`,
          [comment_arr],
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

  // [DELETE] /posts/comments/:comment_id
  deleteComment(req, res) {
    const { comment_id } = req.body;
    const user_id = req.userInfo.user_id;

    const promise = () => {
      return new Promise((resolve, reject) => {
        const sql = `delete from post_comments where comment_id=? and user_id=?`;
        const data = [comment_id, user_id];
        console.log(data);
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

  // [PUT] /posts/comments/:comment_id
  editComment(req, res) {
    const { comment_id, new_comment } = req.body;
    const file = req.file;
    const user_id = req.userInfo.user_id;
    let file_url;
    let file_type;

    if (file) {
      file_url = 'http://127.0.0.1:5000/videos/' + file?.filename;
      file_type = 'video';
      if (isImage(file.originalname)) {
        file_url = 'http://127.0.0.1:5000/images/' + file?.filename;
        file_type = 'image';
      }
    }

    const promise = () => {
      return new Promise((resolve, reject) => {
        let sql = '';
        let data = [];
        if (new_comment) {
          sql = `update post_comments set content=?, is_edited=true where comment_id=? and user_id=?`;
          data = [new_comment, comment_id, user_id];
        }
        if (file) {
          sql = `update post_comments set content=?, is_edited=true, type=? where comment_id=? and user_id=?`;
          data = [file_url, file_type, comment_id, user_id];
        }

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

  // [GET] /posts/comments/:post_id
  getCommentOfPost(req, res) {
    const { post_id } = req.query;
    const user_id = req.userInfo.user_id;

    if (!post_id) {
      console.log('post_id is undefined');
      return;
    }

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `select post_comments.*, users.full_name, users.user_avatar from post_comments
          inner join users
          on post_comments.user_id = users.user_id
          where post_id = ${post_id}`,
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

  // [POST] /posts/reactions/:post_id
  insertReaction(req, res) {
    const user_id = req.userInfo.user_id;
    const { post_id, reaction_type, created_at } = req.body;

    if (!post_id || !reaction_type || !created_at) {
      console.log('post_id || reaction_type || created_at is undefined');
      return;
    }

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `replace into post_reactions(post_id, user_id, type, created_at) 
            values(${post_id}, ${user_id}, '${reaction_type}', '${created_at}')`,
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

  // [POST] /posts/sharing
  sharePost(req, res) {
    const user_id = req.userInfo.user_id;
    const { ref_post_id, text_content, created_at } = req.body;

    if (!ref_post_id || !created_at) {
      console.log('ref_post_id || created_at is undefined');
      return;
    }

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `insert into posts (author_id, text_content, created_at, ref_post_id) values(${user_id}, "${text_content}", "${created_at}", ${ref_post_id});`,
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

  // [GET] /posts/sharing
  getSharingPost(req, res) {
    const { quantity, last_post_index } = req.query;

    const user_id = req.userInfo.user_id;

    const sql = `
    select p1.*, u1.full_name as author_full_name, u1.user_avatar as author_avatar, p2.post_id as ref_post_id, p2.author_id as ref_author_id, p2.text_content as ref_text_content, p2.created_at as ref_created_at, u2.full_name as ref_user_full_name, u2.user_avatar as ref_user_avatar from posts p1
      inner join posts p2
	  on p1.ref_post_id = p2.post_id
      inner join users u1
      on p1.author_id = u1.user_id
      inner join users u2
      on p2.author_id = u2.user_id
    where p1.post_id < ${last_post_index}
      order by p1.created_at desc limit ${quantity};

    select * from post_reactions 
    where post_reactions.post_id in (
      select p1.post_id from posts p1
        inner join posts p2
        on p1.ref_post_id = p2.post_id
      ) and post_reactions.user_id = ${user_id};

    select post_id, count(*) as count from post_comments
      where post_id in (
        select post_id from posts
        where ref_post_id is not null
      )
      group by post_id;
      
    select post_id, type, count(*) as count from post_reactions
      where post_id in (
        select post_id from posts
        where ref_post_id is not null
      )
      group by post_id, type;
      select * from post_files
      where post_id in (
        select p1.ref_post_id from posts p1
        inner join posts p2
        on p1.ref_post_id = p2.post_id
      )
  `;

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve({
              posts: result[0],
              reacted_posts_by_user_id: result[1],
              comments: result[2],
              reactions: result[3],
              files: result[4],
            });
          }
        });
      });
    };

    promise()
      .then((result) => {
        const { posts, reacted_posts_by_user_id, comments, reactions, files } = result;
        posts.forEach((post) => {
          post.reaction_quantity = 0;
          post.files = [];

          reacted_posts_by_user_id.forEach((react_item) => {
            if (post.post_id == react_item.post_id) {
              post.is_reacted = true;
              post.react_type = react_item.type;
              post.reacted_at = react_item.created_at;
            }
          });

          comments.forEach((comment) => {
            if (comment.post_id == post.post_id) {
              post.comment_quantity = comment.count;
            }
          });
          post.reaction_info = [];
          reactions.forEach((reaction) => {
            if (reaction.post_id == post.post_id) {
              if (reaction.type == 'like') {
                post.reaction_quantity += reaction.count;
                post.reaction_info.push({ type: 'like', quantity: reaction.count });
              } else if (reaction.type == 'love') {
                post.reaction_quantity += reaction.count;
                post.reaction_info.push({ type: 'love', quantity: reaction.count });
              } else if (reaction.type == 'sad') {
                post.reaction_quantity += reaction.count;
                post.reaction_info.push({ type: 'sad', quantity: reaction.count });
              } else if (reaction.type == 'haha') {
                post.reaction_quantity += reaction.count;
                post.reaction_info.push({ type: 'haha', quantity: reaction.count });
              } else if (reaction.type == 'angry') {
                post.reaction_quantity += reaction.count;
                post.reaction_info.push({ type: 'angry', quantity: reaction.count });
              } else if (reaction.type == 'wow') {
                post.reaction_quantity += reaction.count;
                post.reaction_info.push({ type: 'wow', quantity: reaction.count });
              }
            }
          });

          files.forEach((file) => {
            if (file.post_id == post.ref_post_id) {
              post.files.push({
                url: file.file_url,
                type: file.type,
                file_id: file.file_id,
                file_name: file.file_name,
                file_size: file.file_size,
              });
            }
          });
        });
        res.send(posts);
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }

  // [DELETE] /posts/reactions/:post_id
  unReact(req, res) {
    const user_id = req.userInfo.user_id;
    const { post_id } = req.body;

    if (!post_id) {
      console.log('post_id is undefined');
      return;
    }

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `delete from post_reactions
            where post_id = ${post_id} and user_id = ${user_id}`,
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
}

module.exports = new PostController();
