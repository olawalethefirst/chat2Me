// import express from "express";
// import { getGroqModels } from "../controllers/groqController.js";

// const modelsRouter = express.Router();

// modelsRouter.get("/models", getGroqModels);

// export default modelsRouter




// // implementation from models.js




import express from "express";
import { jest } from "@jest/globals";
import request from 'supertest';

jest.unstable_mockModule("../controllers/groqController.js", () => ({
    getGroqModels: jest.fn()
}))
const { getGroqModels } = await import("../controllers/groqController.js");
const { server } = import("../index.js");

describe("/models route behaves expectedly ",() => {
    it("responds with models when request is successful", async () => {
        const mockModelsResponse = {
            "success": true,
            "data": {
                "object": "list",
                "data": []
            }
        }
        getGroqModels.mockResolvedValue(mockModelsResponse)

        const res = await request(server).get('/api/models');
        // expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(mockModelsResponse);
    })

    // it("responds with models when request is successful", () => {

    // })
})