import tableService from "../service/table-service.js";
import { logger } from "../application/logging.js";

const create = async (req, res, next) => {
    try {
        const user = req.user;
        const request = req.body;
        const result = await tableService.create(user, request);
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e)
    }
};

const get = async (req, res, next) => {
    try {
        const tableName = req.params.tableName;
        const result = await tableService.search(tableName);
        // name String @db.VarChar(100)
        let namaModelOri = result[0].namaTable
        let namaModel = result[0].namaTable.charAt(0).toUpperCase() + result[0].namaTable.slice(1);
        let model = "<br>" +
            'model ' + namaModel + "{<br>"
        model = model + "&nbsp;&nbsp;id  Int  @id @default(autoincrement()) <br>"
        result.forEach(element => {
            model = model + "&nbsp;&nbsp;" + element.namaKolom + " "
            if (element.tipe === "Varchar") {
                model = model + " String"
                if (element.notNull === "Y") {
                    model = model + " @db.VarChar(" + element.panjang + ") <br>"
                }
                if (element.notNull === "N") {
                    model = model + "? @db.VarChar(" + element.panjang + ") <br>"
                }
            }
        });
        model = model + "&nbsp;&nbsp;createdAt DateTime @default(now())<br>" +
            "&nbsp;&nbsp;updatedAt DateTime @default(now())<br>" +
            "&nbsp;&nbsp;createBy String? @db.VarChar(20)<br>" +
            "&nbsp;&nbsp;updateBy String? @db.VarChar(20)<br>"
        model = model + "<br>&nbsp;&nbsp;@@map(\"" + result[0].namaTable + "s\")<br>}"

        model = model + "<br><br>"

        let validate = "" +
            "import Joi from \"joi\";<br><br>"
        validate = validate + "const create" + namaModel + "Validation = Joi.object({"
        result.forEach(element => {
            validate = validate + "<br>&nbsp;&nbsp;" + element.namaKolom + " : Joi."
            if (element.tipe === "Varchar") {
                validate = validate + "string().max(" + element.panjang + ")"
                if (element.notNull === "Y") {
                    validate = validate + ".required(),"
                }
                if (element.notNull === "N") {
                    validate = validate + ".optional(),"
                }
            }
        });
        validate = validate + "<br>});<br><br>"
        validate = validate + "const update" + namaModel + "Validation = Joi.object({<br>" +
            "id : Joi.number().positive().required(),"
        result.forEach(element => {
            validate = validate + "<br>&nbsp;&nbsp;" + element.namaKolom + " : Joi."
            if (element.tipe === "Varchar") {
                validate = validate + "string().max(" + element.panjang + ")"
                if (element.notNull === "Y") {
                    validate = validate + ".required(),"
                }
                if (element.notNull === "N") {
                    validate = validate + ".optional(),"
                }
            }
        });
        validate = validate + "<br>});<br><br>"
            + "<br>const get" + namaModel + "Validation = Joi.number().positive().required();// engga pake object,pake ID<br><br>"
            + "const search" + namaModel + "Validation = Joi.object({<br>" +
            "&nbsp;&nbsp;page: Joi.number().min(1).positive().default(1),<br>" +
            "&nbsp;&nbsp;size: Joi.number().min(1).positive().max(100).default(10),"
        result.forEach(element => {
            validate = validate + "<br>&nbsp;&nbsp;" + element.namaKolom + " : Joi."
            if (element.tipe === "Varchar") {
                validate = validate + "string().max(" + element.panjang + ")"
                if (element.notNull === "Y") {
                    validate = validate + ".optional(),"
                }
                if (element.notNull === "N") {
                    validate = validate + ".optional(),"
                }
            }
        });
        validate = validate + "<br>});<br><br>"
        validate = validate + "export {<br>" +
            "&nbsp;&nbsp;create" + namaModel + "Validation,<br>" +
            "&nbsp;&nbsp;get" + namaModel + "Validation,<br>" +
            "&nbsp;&nbsp;update" + namaModel + "Validation,<br>" +
            "&nbsp;&nbsp;search" + namaModel + "Validation,<br>}"
        validate = validate + "<br><br>"

        let space = "&nbsp;&nbsp;"
        let space2 = space + space + space + space + space + space + space + space;

        // ===============SERVICE  CREATE====
        let service = "// ===============SERVICE  CREATE====<br>" +
            "import { prismaClient } from \"../application/database.js\";<br>" +
            "import { logger } from \"../application/logging.js\";<br>" +
            "import { ResponseError } from \"../error/response-error.js\";<br>" +
            "import { validat } from \"../validation/validation.js\";<br>" +
            "import { create" + namaModel + "Validation, get" + namaModel +
            "Validation ,update" + namaModel + "Validation,search" + namaModel +
            "Validation} from \"../validation/" + namaModelOri + "-validation.js\";<br><br>"

        service = service + "const create = async (user,request)=>{<br>" +
            "const " + namaModelOri + " = validat(create" + namaModel + "Validation,request);<br>" +
            space + namaModelOri + ".createBy = user.username;<br>" +
            space + "return prismaClient." + namaModelOri + ".create({<br>" +
            space + space + "data: " + namaModelOri + ",<br>" +
            space + space + "select:{<br> id: true,<br>";

        result.forEach(element => {
            if (element.createResponseSukses === "Y") {
                service = service + space2 + space + element.namaKolom + " : true, <br>"
            }
        });
        service = service + space2 + "   }<br>" +
            space + "})<br>" + "}<br><br><br>"

        // ===============SERVICE  GET====
        service = service + "//===============SERVICE  GET====<br>" +
            "const get = async(user," + namaModelOri + "Id)=>{<br> const" +
            space + namaModelOri + " = validat(get" + namaModel + "Validation," + namaModelOri + "Id);<br>" +
            space + "const " + namaModel + " = await prismaClient." + namaModelOri + ".findFirst({<br>" +
            space + "where :{<br>" +
            space2 + "id : " + namaModelOri + ".Id<br>" +
            space + "},<br>" +
            space + "select: {<br> id:true,<br>"

        result.forEach(element => {
            if (element.getResponse === "Y") {
                service = service + space2 + space + element.namaKolom + " : true, <br>"
            }
        });

        service = service + space2 + "   }<br>" +
            space + "})<br>" +
            space + "if (!" + namaModel + ") {<br>" +
            space2 + "throw new ResponseError(404, \"" + namaModelOri + " is not found\");<br>" +
            space + "}<br>" +
            space + "logger.info(" + namaModelOri + ");<br>" +
            space + "return " + namaModel + ";<br>}<br><br>"

        //  ===============SERVICE UPDATE=====================
        service = service + "//===============SERVICE UPDATE=====================<br>" +
            "const update = async (user,request)=>{<br>" +
            space + "const " + namaModelOri + " = validat(update" + namaModel + "Validation,request);<br>" +
            "" + namaModelOri + ".updateBy = user.username;<br>" +
            space + "const total" + namaModel + "InDatabase = await prismaClient." + namaModelOri + ".count({<br>" +
            space + space + "where :{<br>" +
            space2 + "// /*createBy: user.username,*/<br>" +
            space2 + "id : " + namaModelOri + ".id<br>" +
            space2 + "}<br>" +
            space + space + "});<br>" +
            space + "if (total" + namaModel + "InDatabase !== 1){<br>" +
            space2 + "throw new ResponseError(404,'" + namaModel + " is not found');<br>" +
            space + "}<br>" +
            space + "return prismaClient." + namaModelOri + ".update({<br>" +
            space + "where :{<br>" +
            space2 + "id : " + namaModelOri + ".id<br>" +
            space2 + "},<br>" +
            space + "data :{<br> updateBy: user.username, <br>"
        result.forEach(element => {
            service = service + space2 + space + element.namaKolom + " : " + namaModelOri + "." + element.namaKolom + ",<br>"
        });
        service = service + space2 + "},<br>" + "select: {<br>";
        result.forEach(element => {
            if (element.updateResponseSukses === "Y") {
                service = service + space2 + space + element.namaKolom + " : true, <br>"
            }
        });
        service = service + space2 + "}<br>"
        service = service + space + "})<br>" + "}<br><br>"

        //  ===============SERVICE REMOVE=====================
        let service2 = "//===============SERVICE REMOVE=====================<br>" +
            "const remove = async (user," + namaModelOri + "Id)=>{<br>" +
            space + "" + namaModelOri + "Id = validat(get" + namaModel + "Validation," + namaModelOri + "Id);<br>" +
            space + "const totalInDatabase = await prismaClient." + namaModelOri + ".count({<br>" +
            space + "where :{<br>" +
            space2 + "// /* username : user.username,*/<br>" +
            space2 + "id : " + namaModelOri + "Id<br>" +
            space2 + "}<br>" +
            space + "});<br>" +
            space + "if(totalInDatabase !==1 ){<br>" +
            space2 + "throw new ResponseError(404,\"" + namaModel + " is not found\");<br>" +
            space + "}<br>" +
            space + "return prismaClient." + namaModelOri + ".delete({<br>" +
            space + "where : {<br>" +
            space2 + "id : " + namaModelOri + "Id<br>" +
            space2 + "}<br>" +
            space + "})<br>" +
            space + "}<br><br>"

        //  ===============SERVICE SEARCH=====================
        service2 = service2 + "//===============SERVICE SEARCH=====================<br>" +
            "const search = async (user, request) => {<br>" +
            space + "request = validat(search" + namaModel + "Validation, request);<br>" +
            space + "// 1 ((page - 1) * size) = 0<br>" +
            space + "// 2 ((page - 1) * size) = 10<br>" +
            space + "const skip = (request.page - 1) * request.size;<br>" +
            space + "const filters = [];<br>" +
            space + "filters.push({<br>" +
            space2 + "// /*username: user.username*/<br>" +
            space + "})<br>"
        result.forEach(element => {
            service2 = service2 +
                space + "if (request." + element.namaKolom + ") { <br>" +
                space2 + "filters.push({<br>" +
                space2 + space2 + element.namaKolom + " :{<br>" +
                space2 + space2 + space2 + "contains : request." + element.namaKolom +
                "<br>" + space2 + space2 + "}<br>" + space2 + "});<br>" + space + "}<br>"
        });
        service2 = service2 +
            space + "const " + namaModelOri + " = await prismaClient." + namaModelOri + ".findMany({<br>" +
            space2 + "where: {<br>" +
            space2 + space2 + "AND: filters<br>" +
            space2 + "},<br>" +
            space2 + "take: request.size,<br>" +
            space2 + "skip: skip<br>" +
            space + "});<br>"

        service2 = service2 +
            space + "const totalItems = await prismaClient." + namaModelOri + ".count({<br>" +
            space2 + "where: {<br>" +
            space2 + space2 + "AND: filters<br>" +
            space2 + "}<br>" +
            space + "});<br>"
        service2 = service2 +
            space + "return {<br>" +
            space2 + "data: " + namaModelOri + ",<br>" +
            space2 + "paging: {<br>" +
            space2 + space2 + "page: request.page,<br>" +
            space2 + space2 + "total_item: totalItems,<br>" +
            space2 + space2 + "total_page: Math.ceil(totalItems / request.size)<br>" +
            space2 + "}<br>" +
            space + "}<br>" +
            "}<br>"

        service2 = service2 + "<br><br>" +
            "export default {<br>" +
            space2 + "create,<br>" +
            space2 + "get,<br>" +
            space2 + "update,<br>" +
            space2 + "remove,<br>" +
            space2 + "search<br>" +
            "}<br>" + "<br>"



        // ======================================Controller====================================
        //  ===============Controller Create (POST)=====================
        let control = "//===============Controller Create (POST)=====================<br>" +
            "import " + namaModelOri + "Service from \"../service/" + namaModelOri + "-service.js\";<br>" + "const create  = async(req,res,next)=>{<br>" +
            space2 + "try {<br>" +
            space2 + space2 + "const user = req.user;<br>" +
            space2 + space2 + "const request = req.body;<br>" +
            space2 + space2 + "const result = await " + namaModelOri + "Service.create(user,request);<br>" +
            space2 + space2 + " res.status(200).json({<br>" +
            space2 + space2 + "data : result<br>" +
            space2 + space2 + "})<br>" +
            space2 + "} catch (e) {<br>" +
            space2 + space2 + "next(e)<br>" +
            space2 + "}<br>" +
            "};<br>"

        //  ===============Controller GET=====================
        control = control + "<br>//===============Controller GET=====================<br>" +
            "const get = async (req, res, next) => { <br> " +
            space2 + "try {<br> " +
            space2 + space2 + "const user = req.user;<br> " +
            space2 + space2 + "const " + namaModelOri + "Id = req.params." + namaModelOri + "Id;<br> " +
            space2 + space2 + "const result = await " + namaModelOri + "Service.get(user, " + namaModelOri + "Id);<br> " +
            space2 + space2 + "res.status(200).json({<br> " +
            space2 + space2 + space2 + "data: result<br> " +
            space2 + space2 + "})<br> " +
            space2 + "} catch (e) {<br> " +
            space2 + space2 + "next(e);<br> " +
            space2 + "}<br> " +
            "} <br>" +

            //  ===============Controller UPDATE (PUT)=====================
            "<br>//===============Controller UPDATE (PUT)=====================<br>" +
            "const update = async(req, res, next)=>{<br> " +
            space2 + "try {<br> " +
            space2 + space2 + "const user = req.user;<br> " +
            space2 + space2 + "const " + namaModelOri + "Id = req.params." + namaModelOri + "Id;<br> " +
            space2 + space2 + "const request = req.body;<br> " +
            space2 + space2 + "request.id = " + namaModelOri + "Id;<br> " +
            space2 + space2 + "const result = await " + namaModelOri + "Service.update(user,request);<br> " +
            space2 + space2 + "res.status(200).json({<br> " +
            space2 + space2 + space2 + "data : result<br> " +
            space2 + space2 + "})<br> " +
            space2 + "} catch (e) {<br> " +
            space2 + space2 + "next(e);<br> " +
            space2 + "}<br> " +
            "}<br> " +
            //  ===============Controller Remove (REMOVE)=====================
            "//  ===============Controller Remove (REMOVE)=====================<br>" +
            "const remove = async(req,res,next)=>{<br> " +
            space2 + "try {<br> " +
            space2 + space2 + "const user = req.user;<br> " +
            space2 + space2 + "const " + namaModelOri + "Id = req.params." + namaModelOri + "Id;<br> " +
            space2 + space2 + "await " + namaModelOri + "Service.remove(user," + namaModelOri + "Id);<br> " +
            space2 + space2 + "res.status(200).json({<br> " +
            space2 + space2 + space2 + "data : \"OK\"<br> " +
            space2 + space2 + "})<br> " +
            space2 + "} catch (e) {<br> " +
            space2 + space2 + "next(e)<br> " +
            space2 + "}<br> " +
            "}<br>" +

            //  ===============Controller Search (GET)=====================
            "//===============Controller Search (GET)=====================<br>" +
            "const search = async (req, res, next) => {<br> " +
            space2 + "try {<br> " +
            space2 + space2 + "const user = req.user;<br> " +
            space2 + space2 + "const request = {<br> "

        result.forEach(element => {
            control = control + space2 + space2 + space2 + element.namaKolom + ": req.query." + element.namaKolom + ",<br> "
        });

        control = control +
            space2 + space2 + space2 + "page: req.query.page,<br> " +
            space2 + space2 + space2 + "size: req.query.size<br> " +
            space2 + space2 + "};<br> " +

            space2 + space2 + "const result = await " + namaModelOri + "Service.search(user, request);<br> " +
            space2 + space2 + "res.status(200).json({<br> " +
            space2 + space2 + space2 + "data: result.data,<br> " +
            space2 + space2 + space2 + "paging: result.paging<br> " +
            space2 + space2 + "});<br> " +
            space2 + "} catch (e) {<br> " +
            space2 + space2 + "next(e);<br> " +
            space2 + "}<br> " +
            "}<br> <br>" +
            "export default {" +
            space2 + "create,<br> " +
            space2 + "get,<br> " +
            space2 + "update,<br> " +
            space2 + "remove,<br> " +
            space2 + "search<br> " +
            "} <br> "
        control = control + "<br>"


        // ==============================TEST==================================
        let test = "" +
            "<br>import supertest from \"supertest\";<br> " +
            "import { web } from \"../application/web.js\"<br> " +
            "import { logger } from \"../application/logging.js\";<br> " +
            "import { prismaClient } from \"../application/database.js\"<br>" +
            "import { createTestUser,removeTestUser/*,removeAllTest" + namaModel + "s,createTest" + namaModel +
            ",getTest" + namaModel + ",createManyTest" + namaModel + "s */} from \"./util.test.js\";;<br> "

        test = test + "<br>" +
            "describe('POST /api/" + namaModelOri + "s', () => {<br>" +
            " beforeEach(async () => {<br>" +
            "await createTestUser();<br>" +
            "});<br>" +
            "afterEach(async () => {<br>" +
            "await removeTestUser();<br>" +
            "// /*remove allTest" + namaModelOri + "*/<br>" +
            "await prismaClient." + namaModelOri + ".deleteMany({<br>" +
            "where : {<br>" +
            "createBy : \"test\",<br>"
        test = test +
            "}" +
            "})<br>" +
            "});<br>" +
            "it('it should can create new " + namaModelOri + "',async () => {<br>" +
            "const result = await supertest(web)<br>" +
            ".post('/api/" + namaModelOri + "s')<br>" +
            ".set('Authorization', 'test')<br>" +
            ".send({<br>"
        result.forEach(element => {
            test = test + element.namaKolom + " : \"" + element.testValue + "\",<br>"
        });
        test = test + "});<br>" +
            "logger.info(result);<br>" +
            "expect(result.status).toBe(200);<br>" +
            "expect(result.body.data.id).toBeDefined();<br>"

        result.forEach(element => {
            test = test + "expect(result.body.data." + element.namaKolom + ").toBe(\"" + element.testValue + "\");<br>"
        });

        test = test +
            "});<br>"

        // create not valid
        test = test +
            "it('it should reject if request is not valid',async () => {<br>" +
            "const result = await supertest(web)<br>" +
            ".post('/api/" + namaModelOri + "s')<br>" +
            ".set('Authorization', 'test')<br>" +
            ".send({<br>"
        result.forEach(element => {
            test = test + element.namaKolom + " : \"\",<br>"
        });
        test = test + "createBy : \"test\",<br>" +
            "});<br>" +
            "expect(result.status).toBe(400);<br>" +
            "expect(result.body.errors).toBeDefined();<br>" +
            "});<br>" +
            "});<br>"

        test = test + "<br>" +
            "describe('GET /api/" + namaModelOri + "s/:" + namaModelOri + "Id', function () {<br>" +
            "beforeEach(async () => {<br>" +
            "await createTestUser();<br>" +
            "await prismaClient." + namaModelOri + ".create({<br>" +
            "data: {<br>"
        result.forEach(element => {
            test = test + element.namaKolom + " : \"" + element.testValue + "\",<br>"
        });
        test = test + "createBy : \"test\",<br>" +
            "}<br>" +
            "})<br>" +
            "})<br>" +

            "afterEach(async () => {<br>" +
            "await prismaClient." + namaModelOri + ".deleteMany({<br> " +
            "where : {<br> " +
            "createBy : \"test\",<br>"
        result.forEach(element => {
            test = "//" + test + element.namaKolom + " : \"" + element.testValue + "\",<br>"
        });

        test = test +
            "}<br> " +
            "})<br> " +
            "await removeTestUser();<br>" +
            "})<br>" +

            "it('should can get " + namaModelOri + "', async () => {<br>" +
            "const test" + namaModel + " = await prismaClient." + namaModelOri + ".findFirst({" + "<br>" +
            "where: {" + "<br>//createBy : \"test\",<br>"
        result.forEach(element => {
            test = test + element.namaKolom + " : \"" + element.testValue + "\",<br>"
        });
        test = test +
            "}})<br>" +

            "const result = await supertest(web)<br>" +
            ".get(\"/api/" + namaModelOri + "s/\" + test" + namaModel + ".id)<br>" +
            ".set('Authorization', 'test');<br>" +
            "expect(result.status).toBe(200);<br>" +
            "expect(result.body.data.id).toBe(test" + namaModel + ".id);<br>"

        result.forEach(element => {
            test = test + "expect(result.body.data." + element.namaKolom + ").toBe(test" + namaModel + "." + element.namaKolom + ");<br>"
        });

        test = test + "});<br>"
        test = test + "});<br>"

        // ===========TEST UPDATE===========
        test = test + "<br>" +
            "describe('PUT /api/" + namaModelOri + "/:" + namaModelOri + "Id', () => {<br>" +
            "beforeEach(async () => {<br>" +
            "await createTestUser();<br>" +
            "// /*createTest" + namaModelOri + ";*/<br>" +
            "await prismaClient." + namaModelOri + ".create({<br>" +
            "data: {<br>" + "createBy : \"test\",<br>"
        result.forEach(element => {
            test = test + element.namaKolom + " : \"" + element.testValue + "\",<br>"
        });
        test = test +
            "}<br>" +
            "})<br>" +
            "})<br>" +

            "afterEach(async () => {<br>" +
            "// /* removeAllTest" + namaModelOri + "*/<br> " +
            "await prismaClient." + namaModelOri + ".deleteMany({<br> " +
            "where : {<br> " + "createBy : \"test\",<br>"

        test = test +
            "}<br> " +
            "})<br> " +
            "await removeTestUser();<br>" +
            "})<br>" +
            "it('it should can update existing " + namaModelOri + "', async() => {<br> " +
            "const test" + namaModel + " = await prismaClient." + namaModelOri + ".findFirst({" +
            "where: {" + "createBy : \"test\",<br>"


        test = test +
            "}" +
            "})<br>" +
            "const result = await supertest(web)<br> " +
            ".put('/api/" + namaModelOri + "s/'+test" + namaModel + ".id)<br> " +
            ".set('Authorization', 'test')<br> " +
            ".send({<br> "
        result.forEach(element => {
            test = "" + test + element.namaKolom + " : \"" + element.testValue + "X\",<br>"
        });

        test = test +
            "})<br> " + "logger.info(test" + namaModel + ");<br> " +
            "expect(result.status).toBe(200);<br> "

        result.forEach(element => {
            test = test + "expect(result.body.data." + element.namaKolom + ").toBe(\"" + element.testValue + "X\"" + ");<br>"
        });
        test = test + " });<br>" + "});<br><br>"
        test = test + "//test delete<br><br>" +
            "describe('Delete api/" + namaModelOri + "/:" + namaModelOri + "Id', () => {<br> " +
            "beforeEach(async () => {<br> " +
            "await createTestUser();<br> " + "await prismaClient." + namaModelOri + ".create({<br>" +
            "data: {<br>" + "createBy : \"test\",<br>"
        result.forEach(element => {
            test = "//" + test + element.namaKolom + " : \"" + element.testValue + "\",<br>"
        });
        test = test +
            "}<br>" +
            "})<br> " + "})<br> " +

            "afterEach(async () => {<br> " +
            "// rem*oveAllTest" + namaModelOri + "<br> " +
            "await prismaClient." + namaModelOri + ".deleteMany({<br> " +
            "where : {<br> " + "createBy : \"test\",<br>"


        test = test +
            "}<br> " +
            "})<br> " +
            "await removeTestUser();<br>" +
            "})<br> " +
            " it('should can delete " + namaModelOri + "', async() => {<br> " +
            "let  test" + namaModel + " = /*await getTest" + namaModel + "();///manual coyyyy*/<br> " +
            "await prismaClient." + namaModelOri + ".findFirst({" +
            "where: {" + "createBy : \"test\",<br>"

        test = test + "}<br>" +
            "})<br>" +
            "const result = await supertest(web)<br> " +
            ".delete('/api/" + namaModelOri + "s/'+test" + namaModel + ".id)<br> " +
            ".set('Authorization', 'test')<br> " +
            "expect(result.status).toBe(200);<br> " +
            "expect(result.body.data).toBe(\"OK\");<br> " +
            "test" + namaModel + " = <br> " +
            "await prismaClient." + namaModelOri + ".findFirst({" +
            "where: {createBy: \"test\","

        test = test + "}<br>" +
            "})<br>" +
            "expect(test" + namaModel + ").toBeNull();<br> " +
            "});<br>" +
            "  it('should reject if " + namaModelOri + " is not found', async () => {<br> " +
            "let test" + namaModel + " = <br> " +
            "await prismaClient." + namaModelOri + ".findFirst({" +
            "where: {" + "createBy : \"test\",<br>"

        test = test + "}<br>" +
            "})<br>"
        test = test +
            "const result = await supertest(web)<br> " +
            ".delete('/api/" + namaModelOri + "s/' + (test" + namaModel + ".id + 1))<br> " +
            ".set('Authorization', 'test');<br> " +
            "expect(result.status).toBe(404);<br> " +
            "});<br>"

        test = test + "});<br>"

        test = test +
            "//----------- search test--------------<br> " +
            "describe('GET /api/" + namaModelOri + "s', function () {<br> " +
            "beforeEach(async () => {<br> " +
            "await createTestUser();<br> " +
            "//aw*ait createManyTest" + namaModel + "s();<br> " +
            "for (let i = 0; i < 15; i++) {<br> " +
            "await prismaClient." + namaModelOri + ".create({<br> " +
            "data: {<br> "
        result.forEach(element => {
            test = test + element.namaKolom + " : \"" + element.testValue + "\"+i,<br>"
        });
        test = test + "createBy: \"test\"" + "}<br> " +
            "})<br> " +
            "}" +
            "})<br>" +

            "afterEach(async () => {<br> " +
            "//aw*ait removeAllTest" + namaModel + "s();<br> " +
            "await prismaClient." + namaModelOri + ".deleteMany({<br> " +
            "where : {<br> " +
            "createBy : \"test\"<br> " +
            "}<br>" +
            "});"
        test = test +
            "await removeTestUser();<br> " +
            "})<br>" +

            " it('should can search without parameter', async () => {<br> " +
            "const result = await supertest(web)<br> " +
            ".get('/api/" + namaModelOri + "s')<br> " +
            ".set('Authorization', 'test');<br> " +
            "expect(result.status).toBe(200);<br> " +
            "expect(result.body.data.length).toBe(10);<br> " +
            "expect(result.body.paging.page).toBe(1);<br> " +
            "expect(result.body.paging.total_page).toBe(2);<br> " +
            "expect(result.body.paging.total_item).toBe(15);<br> " +
            "});" + "<br></br>" +

            "it('should can search to page 2', async () => {<br> " +
            "const result = await supertest(web)<br> " +
            ".get('/api/" + namaModelOri + "s')<br> " +
            ".query({<br> " +
            "page: 2<br> " +
            "})<br> " +
            ".set('Authorization', 'test');<br> " +
            "expect(result.status).toBe(200);<br> " +
            "expect(result.body.data.length).toBe(5);<br> " +
            "expect(result.body.paging.page).toBe(2);<br> " +
            "expect(result.body.paging.total_page).toBe(2);<br> " +
            "expect(result.body.paging.total_item).toBe(15);<br> " +
            "});<br><br>"


        result.forEach(element => {
            test = test +
                "<br>it('should can search using " + element.namaKolom + "', async () => {<br> " +
                "const result = await supertest(web)<br> " +
                ".get('/api/" + namaModelOri + "s')<br> " +
                ".query({<br> " +
                "" + element.namaKolom + ": \"" + element.testValue + "1\" //sesuaikan yaaa<br> " +
                "})<br> " + ".set('Authorization', 'test');<br> " +
                "expect(result.status).toBe(200);<br> " +
                "expect(result.body.data.length).toBe(6);<br> " +
                "expect(result.body.paging.page).toBe(1);<br> " +
                "expect(result.body.paging.total_page).toBe(1);<br> " +
                "expect(result.body.paging.total_item).toBe(6);<br> " +
                "});<br>"
        });


        test = test +
            "<br>it('should can search using all kriteria', async () => {<br> " +
            "const result = await supertest(web)<br> " +
            ".get('/api/" + namaModelOri + "s')<br> " +
            ".query({<br> "
        result.forEach(element => {
            test = test + element.namaKolom + " : \"" + element.testValue + "1\",<br>"
        });
        test = test + "})<br> " +
            ".set('Authorization', 'test');<br> " +
            "expect(result.status).toBe(200);<br> " +
            "expect(result.body.paging.page).toBe(1);<br> " +
            "expect(result.body.paging.total_page).toBe(1);<br> " +
            "});<br>"

        test = test + "})<br>"

        let route = "<br>" +
            "import " + namaModelOri + "Controller from \"../controller/" + namaModelOri + "-controller.js\";<br><br><br><br>" +
            "userRouter.post('/api/" + namaModelOri + "s'," + namaModelOri + "Controller.create);<br>" +
            "userRouter.get('/api/" + namaModelOri + "s/:" + namaModelOri + "Id', " + namaModelOri + "Controller.get);<br>" +
            "userRouter.put('/api/" + namaModelOri + "s/:" + namaModelOri + "Id', " + namaModelOri + "Controller.update);<br>" +
            "userRouter.delete('/api/" + namaModelOri + "s/:" + namaModelOri + "Id', " + namaModelOri + "Controller.remove);<br>" +
            "userRouter.get('/api/" + namaModelOri + "s', " + namaModelOri + "Controller.search);<br>"

        let doskoman = "<br>" +
            "type nul > src/validation/" + namaModelOri + "-validation.js <br>" +
            "type nul > src/service/" + namaModelOri + "-service.js <br>" +
            "type nul > src/controller/" + namaModelOri + "-controller.js <br>" +
            "type nul > src/test/" + namaModelOri + ".test.js <br> dir<br>";

        let z = ''
        z = z +
            "//============================MODEL====================<br><br>" + model +
            "//============================VALIDATE====================<br><br>" + validate +
            "//============================SERVICE====================<br><br>" + service + service2 +
            "//============================CONTROLLER====================<br><br>" + control +
            "//============================TEST====================<br><br>" + test +
            "//============================ROUTE====================<br><br>" + route +
            "//============================FILE CREATE====================<br><br>" + doskoman
        // z="data kecil"
        logger.info(z)
        res.status(200).send(z)
    } catch (e) {
        next(e);
    }
}


//===============Controller GET=====================
const getAll = async (req, res, next) => {
    const tableName = req.params.tableName;
    // logger.info("############tableName#  "+tableName)
    try {
        const user = req.user;
        // const tableId = req.params.tableId;
        const result = await tableService.getAll(user, tableName);
        res.status(200).json({
            data: result
            })
        // logger.info("Result ===getAll=================================="+tableName)
        // logger.info(result)
    } catch (e) {
        next(e);
    }
}



const getAllName = async (req, res, next) => {
    // const tableName = req.params.tableName;
    logger.info("############table____Name#  ")
    try {
        const user = req.user;
        // const tableId = req.params.tableId;
        const result = await tableService.getTableName();
        res.status(200).json({
            data: result
            })
            logger.info("Result ===getAll==================================")
            logger.info(JSON.stringify(result))
            } catch (e) {
                next(e);
    }
}
export default {
    get,
    getAll,
    create,
    getAllName
}