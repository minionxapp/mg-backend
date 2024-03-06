import supertest from "supertest";
import { web } from "../application/web.js"
import { removeAllTesContact,createTestUser,removeTestUser } from "./util.test";

describe('POST /api/contact', () => {

    beforeEach(async () => {
        await createTestUser();
    });
    afterEach(async () => {
        await removeAllTesContact();
        await removeTestUser();
    });
    it('it should can create new contact',async () => {
        const result = await supertest(web)
        .post('/api/contacts')
        .set('Authorization', 'test')
        .send({
            first_name : "test",
            last_name :"test",
            email : "test@gmail.com",
            phone : "0812111111"
        });
        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.first_name).toBe("test");

    });
    
});