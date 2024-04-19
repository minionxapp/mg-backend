import supertest from "supertest";
import { web } from "../application/web.js"

describe('test pembuatan tables', () => {
    it('should can tables', async () => {
        const result = await supertest(web)
            .get('/api/tables/'+'person') ;

        expect(result.status).toBe(200);
        
    });
    
});