import { appendModels } from "./modifyUI.js";

export async function fetchAndAppendModels() {
  try {
    const response = await fetch("/api/models"); 
      if (!response.ok) throw new Error("Failed to fetch models");
      
    const responseJSON = await response.json();

    const modelOptions = responseJSON.data.data.map(({id, owned_by}) => ({
        label: `${owned_by} - ${id}`,
        value: id
    }))
    
    appendModels(modelOptions); 
  } catch (error) {
      console.error("Error fetching models:", error);
      // Todo: show toast message if this fails
  }
}