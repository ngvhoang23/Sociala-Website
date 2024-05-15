function getExtension(filename) {
  var parts = filename.split('.');
  return parts[parts.length - 1];
}

function isImage(file_name) {
  if (!file_name) return false;
  var ext = getExtension(file_name);
  switch (ext.toLowerCase()) {
    case 'gif':
    case 'jpeg':
    case 'png':
    case 'jpg':
    case 'webp':
      return true;
    default:
  }
  return false;
}

function isVideo(file_name) {
  var ext = getExtension(file_name);
  switch (ext.toLowerCase()) {
    case 'm4v':
    case 'avi':
    case 'mpg':
    case 'mp4':
      return true;
    default:
  }
  return false;
}

function binarySearch(top, bottom, num, array) {
  const mid = Math.floor((top + bottom) / 2);
  if (top > bottom) {
    return -1;
  } else {
    if (array[mid].message_index < num) {
      return binarySearch(mid + 1, bottom, num, array);
    } else if (array[mid].message_index > num) {
      return binarySearch(top, mid - 1, num, array);
    } else {
      return mid;
    }
  }
}

function createId(user_id, room_id, index) {
  let id =
    user_id.toString().padStart(5, '0') +
    room_id.toString().padStart(5, '0') +
    (index != undefined && index != null ? index.toString().padStart(2, '0') : '');
  var now = new Date();
  let month = now.getMonth() + 1;
  let date = now.getDate();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  var components = [
    now.getFullYear().toString(),
    (month > 9 ? '' : '0') + month.toString(),
    (date > 9 ? '' : '0') + date.toString(),
    (hours > 9 ? '' : '0') + hours.toString(),
    (minutes > 9 ? '' : '0') + minutes.toString(),
    now.getSeconds().toString(),
    now.getMilliseconds().toString(),
  ];

  id += components.join('');
  return id;
}

function formatFileSize(file_size) {
  if (file_size / 1024 >= 1 && file_size / 1024 < 1000) {
    return `${Math.floor(file_size / 1024)} KB`;
  } else if (file_size / 1048576 >= 1 && file_size / 1048576 < 1000) {
    return `${Math.floor(file_size / 1048576)} MB`;
  }
  return `${file_size} bytes`;
}

function indexOfNearestLessThan(array, needle) {
  if (array.length === 0) return -1;

  var high = array.length - 1,
    low = 0,
    mid,
    item,
    target = -1;

  while (low <= high) {
    mid = parseInt((low + high) / 2);
    item = new Date(array[mid].created_at);
    if (item > needle) {
      high = mid - 1;
    } else if (item < needle) {
      target = mid;
      low = mid + 1;
    } else {
      return { message_id: array[mid].message_id, index: mid };
    }
  }
  if (target == -1) {
    return -1;
  }
  return { message_id: array[target].message_id, index: target };
}

function formatDate(date = new Date()) {
  const year = date.toLocaleString('default', { year: 'numeric' });
  const month = date.toLocaleString('default', {
    month: '2-digit',
  });
  const day = date.toLocaleString('default', { day: '2-digit' });

  return [year, month, day].join('-');
}

function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''),
  );

  return JSON.parse(jsonPayload);
}

export { isVideo, isImage, binarySearch, createId, formatFileSize, indexOfNearestLessThan, formatDate, parseJwt };
