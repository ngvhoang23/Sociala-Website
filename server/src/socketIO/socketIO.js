let users = [];

const addUser = (user_info, socket_id) => {
  users = users.filter((user) => user.user_id !== user_info.user_id);
  user_info.socket_id = socket_id;
  users.push(user_info);
};

const getUser = (user_id) => {
  return users.find((user) => user.user_id === user_id);
};

const removeUser = (socket_id) => {
  users = users.filter((user) => user.socket_id !== socket_id);
};

function socketInit(io) {
  io.on('connection', (socket) => {
    socket.on('addUser', (user_id) => {
      addUser(user_id, socket.id);
      io.emit('getUsers', users);
    });

    socket.on('join_room', (room_id) => {
      // console.log("join_room");
      // console.log(`User with ID: ${socket.id} joined room: ${room_id}`);
      socket.join(room_id);
    });

    socket.on('leave_room', (room_id) => {
      console.log(`User with ID: ${socket.id} leave room: ${room_id}`);
      socket.leave(room_id);
    });

    // send messages to specify user
    socket.on('send_message', ({ infoMessagePackage, content }) => {
      if (infoMessagePackage.room_type == 1) {
        const user = getUser(infoMessagePackage.receivers[0].user_id);
        if (user) {
          io.to(user.socket_id).emit('receive_message', { infoMessagePackage, content });
        }
      } else {
        const room_id = infoMessagePackage.room_id;
        socket.to(room_id).emit('receive_message', { infoMessagePackage, content });
      }
    });

    // notify whenever messages was sent sucessfully
    socket.on('received_message', ({ user_id, room_id, messageIds }) => {
      const user = getUser(user_id);
      if (user) {
        io.to(user.socket_id).emit('sending_completed', { room_id, messageIds });
      }
    });

    // send files
    socket.on('send_files', ({ infoMessagePackage, content }) => {
      if (infoMessagePackage.room_type == 1) {
        const user = getUser(infoMessagePackage.receivers[0].user_id);
        if (user) {
          io.to(user.socket_id).emit('receive-file', { infoMessagePackage, content });
        }
      } else {
        const room_id = infoMessagePackage.room_id;
        socket.to(room_id).emit('receive-file', { infoMessagePackage, content });
      }
    });

    // typing handler
    socket.on('typing', (data) => {
      const user = getUser(data.receivers[0].user_id);
      if (user) {
        io.to(user.socket_id).emit('typingResponse', data.user);
      }
    });

    socket.on('noLongerTyping', (data) => {
      const user = getUser(data.receivers[0].user_id);
      if (user) {
        io.to(user.socket_id).emit('noLongerTypingResponse', data.user);
      }
    });

    // seen/unSeen message handler
    socket.on('read', (data) => {
      if (data.room_type == 1) {
        const user = getUser(data.receivers[0]?.user_id);
        console.log(user);
        if (user) {
          io.to(user.socket_id).emit('readResponse', {
            userSeen: data.user,
            room_id: data.room_id,
            last_seen_at: data.last_seen_at,
          });
        }
      } else {
        socket.to(data.room_id).emit('readResponse', {
          userSeen: data.user,
          room_id: data.room_id,
          last_seen_at: data.last_seen_at,
        });
      }
    });

    // remove message handler
    socket.on('remove-message-req', (data) => {
      if (data.receivers.length == 1) {
        const user = getUser(data.receivers[0].user_id);
        if (user) {
          io.to(user.socket_id).emit('remove-message-res', data);
        }
      } else {
        socket.to(data.room_id).emit('remove-message-res', data);
      }
    });

    // change room state handler
    socket.on('change-room-state', ({ room_id, notificationPackage }) => {
      socket.to(room_id).emit('room-state-changed', { room_id, notificationPackage });
    });

    // add memebers to room handler
    socket.on('add-members', ({ members, room_id, notificationPackage }) => {
      socket.to(room_id).emit('room-state-changed', { room_id, notificationPackage });
      members.forEach((member) => {
        const user = getUser(member.user_id);
        if (user) {
          io.to(user.socket_id).emit('invite-to-room', { room_id, notificationPackage });
        }
      });
    });

    socket.on('invite-to-new-room', (contact) => {
      contact.members.forEach((member) => {
        const user = getUser(member.user_id);
        if (user) {
          io.to(user.socket_id).emit('invite-to-new-room', contact);
        }
      });
    });

    // catch friend request
    socket.on('send-friend-req', (data) => {
      let { target_user_id } = data;
      target_user_id = Number(target_user_id);
      const user = getUser(target_user_id);
      if (user) {
        io.to(user.socket_id).emit('receive-friend-req', data);
      }
    });

    // catch accept friend request notification
    socket.on('accept-friend-req', (data) => {
      let { target_user_id } = data;
      target_user_id = Number(target_user_id);

      const user = getUser(target_user_id);

      if (user) {
        io.to(user.socket_id).emit('accept-friend-req', data);
      } else {
      }
    });

    // catch reject friend request notification
    socket.on('reject-friend-req', (data) => {
      let { target_user_id } = data;
      target_user_id = Number(target_user_id);

      const user = getUser(target_user_id);

      if (user) {
        io.to(user.socket_id).emit('reject-friend-req', data);
      }
    });

    // catch cancel friend request notification
    socket.on('cancel-friend-req', (data) => {
      let { target_user_id } = data;
      target_user_id = Number(target_user_id);

      const user = getUser(target_user_id);

      if (user) {
        io.to(user.socket_id).emit('cancel-friend-req', data);
      }
    });

    // catch accept friend request notification
    socket.on('un-friend', (data) => {
      let { target_user_id } = data;
      target_user_id = Number(target_user_id);

      const user = getUser(target_user_id);
      if (user) {
        io.to(user.socket_id).emit('un-friend', data);
      }
    });

    // on new post
    socket.on('new-post', (data) => {
      let { target_user_ids } = data;

      target_user_ids.forEach((target_user_id) => {
        const user = getUser(target_user_id);
        if (user) {
          io.to(user.socket_id).emit('new-post', data);
        }
      });
    });

    // on new reaction
    socket.on('react-post', (data) => {
      let { author_id } = data;
      const user = getUser(author_id);
      if (user) {
        io.to(user.socket_id).emit('react-post', data);
      }
    });

    // on new comment
    socket.on('comment-post', (data) => {
      let { author_id } = data;
      const user = getUser(author_id);
      if (user) {
        io.to(user.socket_id).emit('comment-post', data);
      }
    });

    // disconnect to server
    socket.on('disconnect', () => {
      console.log('a user disconnected!');
      removeUser(socket.id);
      io.emit('getUsers', users);
    });
  });
}

module.exports = socketInit;
