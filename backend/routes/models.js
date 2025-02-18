import express from "express";
import { getGroqModels } from "../controllers/groqController.js";

const modelsRouter = express.Router();

modelsRouter.get("/models", getGroqModels);

export default modelsRouter