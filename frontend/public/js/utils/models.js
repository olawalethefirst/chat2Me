export async function fetchModels() {
  try {
    const response = await fetch("/api/models"); 
    if (!response.ok) throw new Error("Failed to fetch models");
      
    const responseJSON = await response.json();

    const modelOptions = responseJSON.data.data.map(({id, owned_by}) => ({
        label: `${owned_by} - ${id}`,
        value: id
    }))
    
    return modelOptions; 
  } catch (error) {
    console.error("Error fetching models:", error);

    throw error.message 
  }
}