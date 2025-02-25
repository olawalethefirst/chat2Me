import { errorMessages } from "../../constants.js";
import { fetchModels } from "../services/groq/fetchModels.js";
import { generateResponse } from "../utils.js";

export const getGroqModels = async (req, res) => {
  try {
    const models = await fetchModels();
    res.json(generateResponse(models));
  } catch (error) {
    res.status(500).json(generateResponse(error, errorMessages.FETCHING_MODELS_FAILED, true));
  }
};
