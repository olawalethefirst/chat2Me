import { createServer } from "node:http";
import {jest} from '@jest/globals';
import { chatEvents, errorMessages } from "../../constants.js";
import ioc from "socket.io-client"
import { Server } from "socket.io"
jest.unstable_mockModule('../services/groq/chat.js', () => ({
  chat: jest.fn(),
}));
// Note: named export preferred over default from modules to ease testing
// Note: using es modules for node based applications could have unexpected implications
const { chat } = await import('../services/groq/chat.js');
const { handleChat } = await import("./handleChat.js");


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
                socket.on(chatEvents.USER_MESSAGE, (data) => handleChat(socket, data));
                console.info("client attemped to connect")
            });
            clientSocket.on("connect", () => { console.info("Client connected:"); done()});
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

    it("should emit a failed response when a chat message fails to complete", async () => {
        chat.mockRejectedValue(new Error("API failure"))

        clientSocket.emit(chatEvents.USER_MESSAGE, "who am I to you");

        await new Promise((resolve) => {
            clientSocket.on(chatEvents.CHAT_ERROR, (response) => {
                expect(response).toEqual(errorMessages.CHAT_ERROR);
                resolve()
            })
        })
    })
})