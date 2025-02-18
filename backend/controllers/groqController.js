import { fetchModels } from "../services/groq/fetchModels.js";
import { generateResponse } from "../utils.js";

export const getGroqModels = async (req, res) => {
  try {
    const models = await fetchModels();
    res.json(generateResponse(models));
  } catch (error) {
    res.status(500).json(generateResponse(null, error.message, true));
  }
};
