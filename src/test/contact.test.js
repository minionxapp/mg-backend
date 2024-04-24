import supertest from "supertest";
import { web } from "../application/web.js"
import { logger } from "../application/logging.js";
import { createTestUser,removeTestUser,removeAllTestContacts,createTestContact,getTestContact,createManyTestContacts } from "./util.test.js";

describe('POST /api/contact', () => {

    beforeEach(async () => {
        await createTestUser();
    });
    afterEach(async () => {
        await removeAllTestContacts();
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
        expect(result.body.data.last_name).toBe("test");
        expect(result.body.data.email).toBe("test@gmail.com");
        expect(result.body.data.phone).toBe("0812111111");
    });

    it('it should reject if request is not valid',async () => {
        const result = await supertest(web)
        .post('/api/contacts')
        .set('Authorization', 'test')
        .send({
            first_name : "",
            last_name :"test",
            email : "testgmail.com",
            phone : "081211111122222222222222222222222222222"
        });

        logger.info(result.body);
        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
       
    });
    
});


describe('GET /api/contacts/:contactId', function () {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    })

    afterEach(async () => {
        await removeAllTestContacts();
        await removeTestUser();
    })

    it('should can get contact', async () => {
        const testContact = await getTestContact();

        const result = await supertest(web)
            .get("/api/contacts/" + testContact.id)
            .set('Authorization', 'test');

     

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBe(testContact.id);
        expect(result.body.data.first_name).toBe(testContact.first_name);
        expect(result.body.data.last_name).toBe(testContact.last_name);
        expect(result.body.data.email).toBe(testContact.email);
        expect(result.body.data.phone).toBe(testContact.phone);
    });
});


describe('PUT /api/contacts/:contactId', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    })

    afterEach(async () => {
        await removeAllTestContacts();
        await removeTestUser();
    })

    it('it should can update existing contact', async() => {
        const testContact = await getTestContact();
        const result = await supertest(web)
        .put('/api/contacts/'+testContact.id)
        .set('Authorization', 'test')
        .send({
            first_name : "mugi",
            last_name :"tmugiest",
            email : "update@mail.com",
            phone : "0812333333"
        })
        logger.info(testContact);
        logger.info(result.body);
        expect(result.status).toBe(200);
        expect(result.body.data.first_name).toBe("mugi");
        expect(result.body.data.last_name).toBe("tmugiest");
        expect(result.body.data.email).toBe("update@mail.com");
        expect(result.body.data.phone).toBe("0812333333");
        
    });
});

describe('Delete api/contact/:contactId', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    })

    afterEach(async () => {
        await removeAllTestContacts();
        await removeTestUser();
    })

    it('should can delete contact', async() => {
        let  testContact = await getTestContact();
        const result = await supertest(web)
        .delete('/api/contacts/'+testContact.id)
        .set('Authorization', 'test')
        expect(result.status).toBe(200);
        expect(result.body.data).toBe("OK");

        testContact = await getTestContact();
        expect(testContact).toBeNull();
    });

    it('should reject if contact is not found', async () => {
        const testContact = await getTestContact();
        const result = await supertest(web)
            .delete('/api/contacts/' + (testContact.id + 1))
            .set('Authorization', 'test');

        expect(result.status).toBe(404);
    });
});

// search
describe('GET /api/contacts', function () {
    beforeEach(async () => {
        await createTestUser();
        await createManyTestContacts();
    })

    afterEach(async () => {
        await removeAllTestContacts();
        await removeTestUser();
    })

    it('should can search without parameter', async () => {
        const result = await supertest(web)
            .get('/api/contacts')
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(10);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(2);
        expect(result.body.paging.total_item).toBe(15);
    });

    it('should can search to page 2', async () => {
        // lo gger.info("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@******************************************************");
        const result = await supertest(web)
            .get('/api/contacts')
            .query({
                page: 2
            })
            .set('Authorization', 'test');

        logger.info("******************************************************");
        // lo gger.info(result);
        // lo gger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(5);
        expect(result.body.paging.page).toBe(2);
        expect(result.body.paging.total_page).toBe(2);
        expect(result.body.paging.total_item).toBe(15);
    });

    it('should can search using name', async () => {
        const result = await supertest(web)
            .get('/api/contacts')
            .query({
                name: "test1"
            })
            .set('Authorization', 'test');

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(6);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.total_item).toBe(6);
    });
//===================Perulangan berdasarkan kolom name==================================SAMPAI SINI DULU
    it('should can search using email', async () => {
        const result = await supertest(web)
            .get('/api/contacts')
            .query({
                email: "test1",
            })
            .set('Authorization', 'test');

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(6);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.total_item).toBe(6);
    });

    it('should can search using phone', async () => {
        const result = await supertest(web)
            .get('/api/contacts')
            .query({
                phone: "0809000001"
            })
            .set('Authorization', 'test');

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(6);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.total_item).toBe(6);
    });

    it('should can search using name,email,phone', async () => {
        const result = await supertest(web)
            .get('/api/contacts')
            .query({
                name: "test1",
                email: "test1",
                phone: "0809000001"
            })
            .set('Authorization', 'test');

        logger.info(result.body);

        expect(result.status).toBe(200);
        // e xpect(result.body.data.length).toBe(6);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        // e xpect(result.body.paging.total_item).toBe(6);
    });
});