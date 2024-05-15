require("dotenv").config({ path: "./config.env" });
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

const models = (module.exports = {
  setFilePublic: async (fileId) => {
    try {
      await drive.permissions.create({
        fileId,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
      });

      const getUrl = await drive.files.get({
        fileId,
        fields: "webViewLink, webContentLink",
      });

      return getUrl;
    } catch (error) {
      console.error(error);
    }
  },
  uploadFiles: async ({ fileData, share }, callback) => {
    try {
      const createFile = await drive.files.create({
        requestBody: {
          name: fileData.file.originalname,
          mime_type: fileData.file.mime_type,
        },
        media: {
          mime_type: fileData.file.mime_type,
          body: fs.createReadStream(`${fileData.file.destination}${fileData.file.filename}`),
        },
      });

      const fileId = createFile.data.id;
      const getUrl = await models.setFilePublic(fileId);
      return {
        url: getUrl.data,
        file_name: fileData.file.originalname,
        fileType: fileData.file.mime_type,
        index: fileData.index,
      };
    } catch (error) {
      callback(error);
    }
  },
  deleteFiles: async (fileId) => {
    try {
      const deleteFile = await drive.files.delete({
        fileId: fileId,
      });
    } catch (error) {
      console.log(error);
    }
  },
});
