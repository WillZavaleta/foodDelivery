import express from "express"
import { getSet, updateSet } from "../controllers/setController.js"

const setRouter = express.Router();

setRouter.post("/update",updateSet);
setRouter.get("/get",getSet);

export default setRouter;