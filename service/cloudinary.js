import dotenv from 'dotenv';
import path from 'path';
dotenv.config({path:path.resolve("config/.env")})
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.cloudName,
  api_key: process.env.cloudApiKey,
  api_secret: process.env.cloudApiSecret,
});

export default cloudinary