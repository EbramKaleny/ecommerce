import mongoose from "mongoose";

const dbConnection = async() => {
  mongoose
    .connect(process.env.DB_URL_ONLINE)
    .then((conn) => {
      console.log("connection to db success");
    }).catch((err)=>console.log({msg:"failed to connect to db",err}))
};

export { dbConnection };
