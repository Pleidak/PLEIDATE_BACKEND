import { v2 as cloudinary } from 'cloudinary'
import {Cloudinary} from '../configs/cloud.js'

cloudinary.config({
  cloud_name: Cloudinary.CLOUD_NAME,
  api_key: Cloudinary.API_KEY,
  api_secret: Cloudinary.API_SECRET,
});

export {cloudinary}