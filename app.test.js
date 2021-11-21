const request = require("supertest");
const app = require("./app");

describe("POST /records", () => {
    describe("given a valid payload",() => {
        describe("example payload given by Getir", () => {

            let requestPayload = {
                "startDate": "2016-01-26",
                "endDate": "2018-02-02",
                "minCount": 2700,
                "maxCount": 3000
            };

            test("response payload status code should be 0", async () => {
                let response = await request(app).post("/records").send(requestPayload);
                expect(response.body.status).toBe(0);
            })

            test("response payload msg should be Success", async () => {
                let response = await request(app).post("/records").send(requestPayload);
                expect(response.body.msg).toBe("Success");
            })

            test("response status code should be 200", async () => {
                let response = await request(app).post("/records").send(requestPayload);
                expect(response.statusCode).toBe(200);
            })

            test("response records should have record data", async () => {
                let response = await request(app).post("/records").send(requestPayload);
                expect(!response.body.records.length).toBe(false);
            })
            
        })

        describe("blank payload sent", () => {

            let requestPayload;

            test("response payload status code should be 0", async () => {
                let response = await request(app).post("/records").send(requestPayload);
                expect(response.body.status).toBe(0);
            })

            test("response payload msg should be Success", async () => {
                let response = await request(app).post("/records").send(requestPayload);
                expect(response.body.msg).toBe("Success");
            })

            test("response status code should be 200", async () => {
                let response = await request(app).post("/records").send(requestPayload);
                expect(response.statusCode).toBe(200);
            })

            test("response records should have record data", async () => {
                let response = await request(app).post("/records").send(requestPayload);
                expect(!response.body.records.length).toBe(false);
            })
            
        })

        describe("no record query", () => {

            let requestPayload = {
                "startDate": "2019-01-26",
                "endDate": "2018-02-02",
                "minCount": 2700,
                "maxCount": 3000
            };

            test("response payload status code should be 2", async () => {
                let response = await request(app).post("/records").send(requestPayload);
                expect(response.body.status).toBe(2);
            })

            test("response payload msg should be No records found", async () => {
                let response = await request(app).post("/records").send(requestPayload);
                expect(response.body.msg).toBe("No records found.");
            })

            test("response status code should be 404", async () => {
                let response = await request(app).post("/records").send(requestPayload);
                expect(response.statusCode).toBe(404);
            })

            test("response records should have record data", async () => {
                let response = await request(app).post("/records").send(requestPayload);
                expect(!response.body.records.length).toBe(true);
            })
            
        })
    });

    describe("given an invalid payload", () => {
        test("invalid date sent in req payload, client should know it's invalid", async () => {
            let requestPayload = {
                "startDate": "2016-0a1-28",
                "endDate": "2020-01-29",
                "minCount": 0,
                "maxCount": "200"
            };
            let response = await request(app).post("/records").send(requestPayload);
            expect(response.body.msg).toBe("The value provided for the startDate attribute is not valid. ");
            expect(response.body.status).toBe(1);
        });
        test("invalid number sent in req payload, client should know it's invalid", async () => {
            let requestPayload = {
                "startDate": "2016-01-28",
                "endDate": "2020-01-29",
                "minCount": "a",
                "maxCount": "200"
            };
            let response = await request(app).post("/records").send(requestPayload);
            expect(response.body.msg).toBe("The value provided for the minCount attribute is not valid. ");
            expect(response.body.status).toBe(1);
        })
    })
});