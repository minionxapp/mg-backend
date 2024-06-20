import supertest from "supertest";
import { web } from "../application/web.js"

import { logger } from "../application/logging.js";
import { prismaClient } from "../application/database.js"
import { createTestUser, removeTestUser/*,removeAllTestTables,createTestTable,getTestTable,createManyTestTables */ } from "./util.test.js";;

describe('POST /api/tables', () => {
    beforeEach(async () => {
        await createTestUser();
    });
    afterEach(async () => {
        await removeTestUser();
        // /*remove allTesttable*/
        await prismaClient.table.deleteMany({
            where: {
                namaTable: "test",
            }
        })
    });
    it('it should can create new table', async () => {
        const result = await supertest(web)
            .post('/api/tables')
            .set('Authorization', 'test')
            .send({
                namaTable: "test",
                namaKolom: "test",
                tipe: "test",
                panjang: 10,
                notNull: "Y",
                createRequest: "Y",
                createResponseSukses: "Y",
                updateRequest: "Y",
                updateResponseSukses: "Y",
                getRequest: "Y",
                getResponse: "Y",
                searchRequest: "Y",
                searchResponse: "Y",
                removeRequest: "Y",
                removeResponse: "Y",
                testValue: "test",
            });
        logger.info(result);
        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.namaTable).toBe("test");
        expect(result.body.data.namaKolom).toBe("test");
        expect(result.body.data.tipe).toBe("test");
        expect(result.body.data.panjang).toBe(10);
        expect(result.body.data.notNull).toBe("Y");
        expect(result.body.data.createRequest).toBe("Y");
        expect(result.body.data.createResponseSukses).toBe("Y");
        expect(result.body.data.updateRequest).toBe("Y");
        expect(result.body.data.updateResponseSukses).toBe("Y");
        expect(result.body.data.getRequest).toBe("Y");
        expect(result.body.data.getResponse).toBe("Y");
        expect(result.body.data.searchRequest).toBe("Y");
        expect(result.body.data.searchResponse).toBe("Y");
        expect(result.body.data.removeRequest).toBe("Y");
        expect(result.body.data.removeResponse).toBe("Y");
        expect(result.body.data.testValue).toBe("test");
    });


    it('should can get Table Name', async () => {
        const tables = await prismaClient.table.findMany({
            // where: {
            //     //createBy : "test",
            //     kode: "kd",
            //     nama: "nama",
            //     jenis: "konven",
            //     status: "Y",
            // }
        })
        const result = await supertest(web)
            .get("/api/tableAll")
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        // expect(result.body.data.id).toBe(testBank.id);
        // expect(result.body.data.kode).toBe(testBank.kode);
        // expect(result.body.data.nama).toBe(testBank.nama);
        // expect(result.body.data.jenis).toBe(testBank.jenis);
        // expect(result.body.data.status).toBe(testBank.status);
    });

})







    //====================
    // describe('test pembuatan tables', () => {
    //     it('should can tables', async () => {
    //         const result = await supertest(web)
    //             .get('/api/tables/' + 'person');

    //         expect(result.status).toBe(200);

    //     });

    // });