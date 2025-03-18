import express from "express"
import { updateTarifa } from "../controllers/setController"

const setRouter = express.Router();

setRouter.post("/update",updateTarifa);

export default setRouter;