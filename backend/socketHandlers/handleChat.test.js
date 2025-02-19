import { createServer } from "node:http";
import {jest} from '@jest/globals';
import handleChat from "./handleChat.js";
import { chatEvents, errorMessages } from "../../constants.js";
import ioc from "socket.io-client"
import { Server } from "socket.io"

jest.unstable_mockModule("../services/groq/chat.js", () => jest.fn()
);
const chat = await import("../services/groq/chat.js")

describe("handleChat", () => {
    let io, serverSocket, clientSocket;

   beforeAll((done) => {
        const httpServer = createServer();
        io = new Server(httpServer);
        httpServer.listen(() => {
            const port = httpServer.address().port;
            clientSocket = ioc(`http://localhost:${port}`);
            io.on("connection", (socket) => {
                serverSocket = socket;
            });
            clientSocket.on("connect", done);
        });
        io.on("connection", (socket) => {
            socket.on(chatEvents.USER_MESSAGE, (data) => handleChat(socket, data));
        });
   })

    afterAll(() => {
        clientSocket.close();
        io.close();
    });


    it("should emit a successful response when a chat message successful completes", async () => {
        const mockResponse = "I am an artificial intelligence model, and you are a user who has interacted with me"
        chat.mockResolvedValue(mockResponse);

        clientSocket.emit(chatEvents.USER_MESSAGE, "who am I to you");
        
        await new Promise((resolve) => {
            clientSocket.on(chatEvents.AI_MESSAGE, (response) => {
                expect(response).toEqual(mockResponse);
                resolve();
            });
        });
    })

    // it("should emit a failed response when a chat message fails to complete", async () => {
    //     chat.mockRejectedValue(new Error("API failure"))

    //     await handleChat(socket, "who am I to you");
    //     expect(socket.emitted(chatEvents.CHAT_ERROR)[0].toEqual(errorMessages.CHAT_ERROR))
    // })
})