import express from "express"
import { updateTarifa } from "../controllers/setController.js"

const setRouter = express.Router();

setRouter.post("/update",updateTarifa);

export default setRouter;