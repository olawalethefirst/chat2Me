import { jest } from "@jest/globals";
import request from 'supertest';
import { errorMessages } from "../../constants.js";

jest.unstable_mockModule("../services/groq/fetchModels.js", () => ({
    fetchModels: jest.fn()
}))
const { fetchModels } = await import("../services/groq/fetchModels.js");
const { app } = await import("../index.js");

describe("/models route behaves expectedly ", () => {
    it("responds with models when request is successful", async () => {
        console.log("starting")
        const mockModelsResponse = {
            "success": true,
            "data": {
                "object": "list",
                "data": []
            }
        }
        fetchModels.mockResolvedValue(mockModelsResponse)
        
        const res = await request(app).get('/api/models');

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toEqual(true);
        expect(res.body.data).toEqual(mockModelsResponse);
    })

    it("responds with an error when request is unsuccessful", async () => {
        fetchModels.mockRejectedValue(new Error("limit exceeded"))

        const res = await request(app).get("/api/models")

        expect(res.statusCode).toEqual(500)
        expect(res.body.success).toEqual(false);
        expect(res.body.message).toEqual(errorMessages.FETCHING_MODELS_FAILED)
    })
})