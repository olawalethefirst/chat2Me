import dotenv from "dotenv";
import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import { errorMessages } from "../constants.js";
import websocketHandler from "./socketHandlers/index.js";
import modelsRouter from "./routes/models.js";


// setup .env variables access
dotenv.config();

// creates new express server
const app = express();

// Get __filename equivalent
const __filename = fileURLToPath(import.meta.url);
// Get __dirname equivalent
const __dirname = path.dirname(__filename);
const __root_dirname = path.dirname(__dirname);


// MIDDLEWARES
// expose Views & Public files
app.use(express.static(__root_dirname + '/frontend/views'))
// expose assets(JS/CSS/Images)
app.use(express.static(__root_dirname + '/frontend/public'))
app.use('/constants.js', express.static(__root_dirname + '/constants.js'))
app.use("/api", modelsRouter)

const server = app.listen(process.env.PORT, () => {
  if (!process.env.GROQ_API_KEY) {
    console.error(errorMessages.GROQ_API_KEY_REQUIRED)
  }
  console.log(`starting application on: `, process.env.PORT)
});

// setup websocket
websocketHandler(server)
