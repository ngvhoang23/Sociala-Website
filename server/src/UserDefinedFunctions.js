function getExtension(filename) {
  var parts = filename.split('.');
  return parts[parts.length - 1];
}

function isImage(file_name) {
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
  }
  return false;
}

function binarySearch(top, bottom, num, array) {
  const mid = Math.floor((top + bottom) / 2);
  if (top > bottom) {
    return -1;
  } else {
    if (array[mid] < num) {
      return binarySearch(mid + 1, bottom, num, array);
    } else if (array[mid] > num) {
      return binarySearch(top, mid - 1, num, array);
    } else {
      return mid;
    }
  }
}

function formatDate(date = new Date()) {
  const year = date.toLocaleString('default', { year: 'numeric' });
  const month = date.toLocaleString('default', {
    month: '2-digit',
  });
  const day = date.toLocaleString('default', { day: '2-digit' });

  return [year, month, day].join('-');
}

function generateToken(length) {
  const characters = '0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

module.exports = { isImage, isVideo, binarySearch, formatDate, generateToken };
