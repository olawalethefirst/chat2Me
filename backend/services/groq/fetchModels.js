import groq from "./instance.js";
import { errorMessages } from "../../../constants.js";

export async function fetchModels() {
    try  {
        const models = await groq.models.list();
    return models
    } catch (error) {
        console.error("Error fetching groq models: ", error)
        throw error
    }
}
