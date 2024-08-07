import { globalErrorHandler } from "../error/errorHandler.js";
import { dbConnection } from "../db/connection.js";
import { appError } from "../error/classError.js";
import * as routers from "../routes/index.js";
import { deleteFromCloudinary } from "../middleware/deleteFromCloudinary.js";
import { deleteFromDB } from "../middleware/deleteFromDB.js";
import cors from "cors";

export const initApp = (app, express) => {
  dbConnection();
  app.use(cors());
  app.use((req, res, next) => {
    if (req.originalUrl == "/order/webhook") {
      next();
    } else {
      express.json()(req, res, next);
    }
  });
  app.get("/", (req, res) => res.status(200).json({ msg: "hello world" }));

  app.use("/user", routers.UR);
  app.use("/category", routers.CR);
  app.use("/brand", routers.BR);
  app.use("/product", routers.PR);
  app.use("/coupon", routers.CpR);
  app.use("/cart", routers.CtR);
  app.use("/order", routers.OR);

  app.all("*", (req, res, next) => {
    next(new appError("page not found", 404));
  });

  app.use(globalErrorHandler, deleteFromCloudinary, deleteFromDB);
};
