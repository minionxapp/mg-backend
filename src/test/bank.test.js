
//============================TEST====================

////////////////
import supertest from "supertest";
import { web } from "../application/web.js"
import { logger } from "../application/logging.js";
import { prismaClient } from "../application/database.js"
import { createTestUser, removeTestUser/*,removeAllTestBanks,createTestBank,getTestBank,createManyTestBanks */ } from "./util.test.js";;

describe('POST /api/banks', () => {
    beforeEach(async () => {
        await createTestUser();
    });
    afterEach(async () => {
        await removeTestUser();
        // /*remove allTestbank*/
        await prismaClient.bank.deleteMany({
            where: {
                createBy: "test",
            }
        })
    });
    it('it should can create new bank', async () => {
        const result = await supertest(web)
            .post('/api/banks')
            .set('Authorization', 'test')
            .send({
                kode: "kd",
                nama: "nama",
                jenis: "konven",
                status: "Y",
            });
        logger.info(result);
        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.kode).toBe("kd");
        expect(result.body.data.nama).toBe("nama");
        expect(result.body.data.jenis).toBe("konven");
        expect(result.body.data.status).toBe("Y");
    });
    it('it should reject if request is not valid', async () => {
        const result = await supertest(web)
            .post('/api/banks')
            .set('Authorization', 'test')
            .send({
                kode: "",
                nama: "",
                jenis: "",
                status: "",
                createBy: "test",
            });
        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
});

describe('GET /api/banks/:bankId', function () {
    beforeEach(async () => {
        await createTestUser();
        await prismaClient.bank.create({
            data: {
                kode: "kd",
                nama: "nama",
                jenis: "konven",
                status: "Y",
                createBy: "test",
            }
        })
    })
    afterEach(async () => {
        await prismaClient.bank.deleteMany({
            where: {
                createBy: "test",
                kode: "kd",
                nama: "nama",
                jenis: "konven",
                status: "Y",
            }
        })
        await removeTestUser();
    })
    it('should can get bank', async () => {
        const testBank = await prismaClient.bank.findFirst({
            where: {
                //createBy : "test",
                kode: "kd",
                nama: "nama",
                jenis: "konven",
                status: "Y",
            }
        })
        const result = await supertest(web)
            .get("/api/banks/" + testBank.id)
            .set('Authorization', 'test');
        expect(result.status).toBe(200);
        expect(result.body.data.id).toBe(testBank.id);
        expect(result.body.data.kode).toBe(testBank.kode);
        expect(result.body.data.nama).toBe(testBank.nama);
        expect(result.body.data.jenis).toBe(testBank.jenis);
        expect(result.body.data.status).toBe(testBank.status);
    });
});

describe('PUT /api/bank/:bankId', () => {
    beforeEach(async () => {
        await createTestUser();
        // /*createTestbank;*/
        await prismaClient.bank.create({
            data: {
                createBy: "test",
                kode: "kd",
                nama: "nama",
                jenis: "konven",
                status: "Y",
            }
        })
    })
    afterEach(async () => {
        // /* removeAllTestbank*/
        await prismaClient.bank.deleteMany({
            where: {
                createBy: "test",
            }
        })
        await removeTestUser();
    })

    it('it should can update existing bank', async () => {
        const testBank = await prismaClient.bank.findFirst({
            where: {
                createBy: "test",
            }
        })
        const result = await supertest(web)
            .put('/api/banks/' + testBank.id)
            .set('Authorization', 'test')
            .send({
                kode: "kdX",
                nama: "namaX",
                jenis: "konvenX",
                status: "YX",
            })
        logger.info(testBank);
        expect(result.status).toBe(200);
        expect(result.body.data.kode).toBe("kdX");
        expect(result.body.data.nama).toBe("namaX");
        expect(result.body.data.jenis).toBe("konvenX");
        expect(result.body.data.status).toBe("YX");
    });
});

//test delete

describe('Delete api/bank/:bankId', () => {
    beforeEach(async () => {
        await createTestUser();
        await prismaClient.bank.create({
            data: {
                createBy: "test",
                kode: "kd",
                nama: "nama",
                jenis: "konven",
                status: "Y",
            }
        })
    })
    afterEach(async () => {
        // rem*oveAllTestbank
        await prismaClient.bank.deleteMany({
            where: {
                createBy: "test",
            }
        })
        await removeTestUser();
    })
    it('should can delete bank', async () => {
        let testBank = /*await getTestBank();///manual coyyyy*/
            await prismaClient.bank.findFirst({
                where: {
                    createBy: "test",
                }
            })
        const result = await supertest(web)
            .delete('/api/banks/' + testBank.id)
            .set('Authorization', 'test')
        expect(result.status).toBe(200);
        expect(result.body.data).toBe("OK");
        testBank =
            await prismaClient.bank.findFirst({
                where: { createBy: "test", }
            })
        expect(testBank).toBeNull();
    });
    it('should reject if bank is not found', async () => {
        let testBank =
            await prismaClient.bank.findFirst({
                where: {
                    createBy: "test",
                }
            })
        const result = await supertest(web)
            .delete('/api/banks/' + (testBank.id + 1))
            .set('Authorization', 'test');
        expect(result.status).toBe(404);
    });
});
//----------- search test--------------
describe('GET /api/banks', function () {
    beforeEach(async () => {
        await createTestUser();
        //aw*ait createManyTestBanks();
        for (let i = 0; i < 15; i++) {
            await prismaClient.bank.create({
                data: {
                    kode: "kd" + i,
                    nama: "nama" + i,
                    jenis: "konven" + i,
                    status: "Y" + i,
                    createBy: "test"
                }
            })
        }
    })
    afterEach(async () => {
        //aw*ait removeAllTestBanks();
        await prismaClient.bank.deleteMany({
            where: {
                createBy: "test"
            }
        }); await removeTestUser();
    })

    it('should can search without parameter', async () => {
        const result = await supertest(web)
            .get('/api/banks')
            .set('Authorization', 'test');
        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(10);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(2);
        expect(result.body.paging.total_item).toBe(16);
    });

    it('should can search to page 2', async () => {
        const result = await supertest(web)
            .get('/api/banks')
            .query({
                page: 2
            })
            .set('Authorization', 'test');
        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(5);
        expect(result.body.paging.page).toBe(2);
        expect(result.body.paging.total_page).toBe(2);
        expect(result.body.paging.total_item).toBe(15);
    });


    it('should can search using kode', async () => {
        const result = await supertest(web)
            .get('/api/banks')
            .query({
                kode: "kd1" //sesuaikan yaaa
            })
            .set('Authorization', 'test');
        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(6);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.total_item).toBe(6);
    });

    it('should can search using nama', async () => {
        const result = await supertest(web)
            .get('/api/banks')
            .query({
                nama: "nama1" //sesuaikan yaaa
            })
            .set('Authorization', 'test');
        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(6);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.total_item).toBe(6);
    });

    it('should can search using jenis', async () => {
        const result = await supertest(web)
            .get('/api/banks')
            .query({
                jenis: "konven1" //sesuaikan yaaa
            })
            .set('Authorization', 'test');
        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(6);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.total_item).toBe(6);
    });

    it('should can search using status', async () => {
        const result = await supertest(web)
            .get('/api/banks')
            .query({
                status: "Y1" //sesuaikan yaaa
            })
            .set('Authorization', 'test');
        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(6);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.total_item).toBe(6);
    });

    it('should can search using all kriteria', async () => {
        const result = await supertest(web)
            .get('/api/banks')
            .query({
                kode: "kd1",
                nama: "nama1",
                jenis: "konven1",
                status: "Y1",
            })
            .set('Authorization', 'test');
        expect(result.status).toBe(200);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
    });
})