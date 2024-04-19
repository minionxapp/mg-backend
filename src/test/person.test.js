import supertest from "supertest";
import { web } from "../application/web.js"
import { logger } from "../application/logging.js";
import { prismaClient } from "../application/database.js"
import { createTestUser, removeTestUser/*,removeAllTestContacts,createTestContact,getTestContact,createManyTestContacts */ } from "./util.test.js";;
describe('POST /api/persons', () => {
    beforeEach(async () => {
        await createTestUser();
    });
    afterEach(async () => {
        // /*await removeAllTestContacts();*/
        await removeTestUser();
        await prismaClient.person.deleteMany({
            where: {
                //username : "test"
                nama: "test",
                alamat: "test",
                nik: "test",
            }
        })
    });
    it('it should can create new person', async () => {
        const result = await supertest(web)
            .post('/api/persons')
            .set('Authorization', 'test')
            .send({
                nama: "test",
                alamat: "test",
                nik: "test",
            });
        logger.info(result);
        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.nama).toBe("test");
        expect(result.body.data.alamat).toBe("test");
        expect(result.body.data.nik).toBe("test");
    });
    it('it should reject if request is not valid', async () => {
        const result = await supertest(web)
            .post('/api/persons')
            .set('Authorization', 'test')
            .send({
                nama: "",
                alamat: "",
                nik: "",
            });
        logger.info(result.body);
        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
});
describe('GET /api/persons/:personId', function () {
    beforeEach(async () => {
        await createTestUser();
        // /*await createTestContact();*/
        await prismaClient.person.create({
            data: {
                nama: "test",
                alamat: "test",
                nik: "test",
            }
        })
    })
    afterEach(async () => {
        //await removeAllTestContacts();
        await prismaClient.person.deleteMany({
            where: {
                nama: "test"
            }
        })
        await removeTestUser();
    })
    it('should can get person', async () => {
        const testPerson = await prismaClient.person.findFirst({
            where: { nama: "test" }
        })
        const result = await supertest(web)
            .get("/api/persons/" + testPerson.id)
            .set('Authorization', 'test');
        expect(result.status).toBe(200);
        expect(result.body.data.id).toBe(testPerson.id);
        expect(result.body.data.nama).toBe(testPerson.nama);
        expect(result.body.data.alamat).toBe(testPerson.alamat);
        expect(result.body.data.nik).toBe(testPerson.nik);
    });
});