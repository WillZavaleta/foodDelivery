import express from "express"
import { addTime, getTimeDia, getTimes, updateTime } from "../controllers/timeController.js"

const timeRouter = express.Router();

timeRouter.get("/get", getTimes);
timeRouter.post("/add", addTime);
timeRouter.post("/update", updateTime);
timeRouter.get("/getone", getTimeDia);

export default timeRouter;