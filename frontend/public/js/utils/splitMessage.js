const snippetAlias = "@";
const snippetAliasJoiner = "^-|-^";


export default function splitMessage(message) {
    const messageCopy = `${message}`
    const messageWithSnippetsAlias = messageCopy.replaceAll(/```.*?```/sg, `${snippetAliasJoiner}${snippetAlias}${snippetAliasJoiner}`);
    const messageWithStrippedSnippets = messageWithSnippetsAlias.split(snippetAliasJoiner)
    const snippets = message.match(/```.*?```/gs)

    const formattedMessage = messageWithStrippedSnippets.map(part => {
        if (part === snippetAlias) {
            const snippetPart = snippets.shift().replace(/```/g, '');
            return { message: snippetPart, type: "code" };
        };
        
        return { message: part, type: "paragraph" };
    })


    return formattedMessage;
}