import groq from "./instance.js";

export async function chat({model = "llama-3.3-70b-versatile", messages=[]}) {
  const completion = await groq.chat.completions
    .create({
      messages: messages.map(message => (
        {
          role: "user",
          content: message,
        }
      )),
      model,
    })

    console.log({completion: JSON.stringify(completion)})

    return completion.choices[0].message.content
}