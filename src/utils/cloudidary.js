const cloudinary = require('cloudinary').v2
const {Cloudinary} = require('../config/cloud.js')

cloudinary.config({
  cloud_name: Cloudinary.CLOUD_NAME,
  api_key: Cloudinary.API_KEY,
  api_secret: Cloudinary.API_SECRET,
});

module.exports = {cloudinary}