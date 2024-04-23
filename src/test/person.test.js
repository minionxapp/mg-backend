import supertest from "supertest";
import { web } from "../application/web.js"
import { logger } from "../application/logging.js";
import { prismaClient } from "../application/database.js"
import { createTestUser, removeTestUser/*,removeAllTestContacts,createTestContact,getTestContact,createManyTestContacts */ } from "./util.test.js";;
//===Begin Test Create===

describe('POST /api/persons', () => {
    beforeEach(async () => {
        await createTestUser();
    });
    afterEach(async () => {
        await removeTestUser();
        /*remove allTestperson*/
        await prismaClient.person.deleteMany({
            where: {
                createBy: "test"              
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
                // createBy: "test",//suda di ser dari service dala object person
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
                // createBy: "test",
            });
        logger.info(result.body);
        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
});
//===Begin Test Get=========================================================

describe('GET /api/persons/:personId', function () {
    beforeEach(async () => {
        await createTestUser();
        // /*createTestperson;*/
        await prismaClient.person.create({
            data: {
                nama: "test",
                alamat: "test",
                nik: "test",
                createBy: "test",
            }
        })
    })
    afterEach(async () => {
        // /* removeAllTestperson*/
        await prismaClient.person.deleteMany({
            where: {
                createBy: "test",
                nama: "test",
                alamat: "test",
                nik: "test",
            }
        })
        await removeTestUser();
    })
    it('should can get person', async () => {
        const testPerson = await prismaClient.person.findFirst({
            where: {//
                // createBy : "test",
                nama: "test",
                // alamat: "test",
                // nik: "test",
            }
        })

        
        logger.info(testPerson)
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
//===Begin Test Update===

describe('PUT /api/person/:personId', () => {
    beforeEach(async () => {
        await createTestUser();
        // /*createTestperson;*/
        await prismaClient.person.create({
            data: {
                createBy: "test",
                nama: "test",
                alamat: "test",
                nik: "test",
            }
        })
    })
    afterEach(async () => {
        /* removeAllTestperson*/
        await prismaClient.person.deleteMany({
            where: {
                createBy: "test",                
            }
        })
        await removeTestUser();
    })
    it('it should can update existing person', async () => {
        const testPerson = await prismaClient.person.findFirst({
            where: {//
                createBy : "test"               
            }
        })
        const result = await supertest(web)
            .put('/api/persons/' + testPerson.id)
            .set('Authorization', 'test')
            .send({
                nama: "testEdit",
                alamat: "testEdit",
                nik: "testEdit",
            })
            logger.info(testPerson);
        logger.info("==============QQ=========="+testPerson.id);
        logger.info(result.body);
        logger.info("==============QQ2==========");
        expect(result.status).toBe(200);
        expect(result.body.data.nama).toBe("testEdit");
        expect(result.body.data.alamat).toBe("testEdit");
        expect(result.body.data.nik).toBe("testEdit");
    });
});

//test delete

describe('Delete api/person/:personId', () => {
    beforeEach(async () => {
        await createTestUser();
        // /*createTestperson;*/
        await prismaClient.person.create({
            data: {
                createBy: "test",
                nama: "test",
                alamat: "test",
                nik: "test",
            }
        })
    })
    afterEach(async () => {
        // /* removeAllTestperson*/
        await prismaClient.person.deleteMany({
            where: {
                createBy: "test",
                // nama: "test",
                // alamat: "test",
                // nik: "test",
            }
        })
        await removeTestUser();
    })
    it('should can delete person', async () => {
        let testPerson = /*await getTestContact();///manual coyyyy*/
            await prismaClient.person.findFirst({
                where: {
                    createBy: "test",
                    // nama: "test",
                    // alamat: "test",
                    // nik: "test",
                }
            })
        const result = await supertest(web)
            .delete('/api/persons/' + testPerson.id)
            .set('Authorization', 'test')
        expect(result.status).toBe(200);
        expect(result.body.data).toBe("OK");
        testPerson =
            await prismaClient.person.findFirst({
                where: {
                    createBy: "test",
                    // nama: "test",
                    // alamat: "test",
                    // nik: "test",
                }
            })
        expect(testPerson).toBeNull();
    });
    it('should reject if person is not found', async () => {
        let testPerson =
            await prismaClient.person.findFirst({
                where: {
                    createBy: "test",
                    // nama: "test",
                    // alamat: "test",
                    // nik: "test",
                }
            })
        const result = await supertest(web)
            .delete('/api/persons/' + (testPerson.id + 1))
            .set('Authorization', 'test');
        expect(result.status).toBe(404);
    });
});