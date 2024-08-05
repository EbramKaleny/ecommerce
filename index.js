import dotenv from 'dotenv';
import path from 'path';
dotenv.config({path:path.resolve("config/.env")})
import express from "express";
import {initApp} from './service/initApp.js';

const app = express();
initApp(app, express)
app.listen(3000, () => {
    console.log("app listening on port 3000");
  });
