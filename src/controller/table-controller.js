import tableService from "../service/table-service.js";


const get = async (req, res, next) => {
    try {
        const tableName = req.params.tableName;
        const result = await tableService.search(tableName);
// name String @db.VarChar(100)
        let namaModelOri =result[0].namaTable
        let namaModel  = result[0].namaTable.charAt(0).toUpperCase() + result[0].namaTable.slice(1);
        let model = 'model '+namaModel+"{<br>"
        model = model + "&nbsp;&nbsp;id  Int  @id @default(autoincrement()) <br>"
        result.forEach(element => {
            model = model +"&nbsp;&nbsp;"+element.namaKolom+" "
            if (element.tipe === "Varchar") {
                model = model + " String"
                if (element.notNull === "Y") {
                    model= model +" @db.VarChar("+element.panjang+") <br>"
                }
                if (element.notNull === "N") {
                    model= model +"? @db.VarChar("+element.panjang+") <br>"
                }
                
                
            }
        });
        model = model +  "&nbsp;&nbsp;createdAt DateTime @default(now())<br>"+
                        "&nbsp;&nbsp;updatedAt DateTime @default(now())<br>"
        model = model + "<br>&nbsp;&nbsp;@@map(\""+result[0].namaTable+"s\")<br>}"
        model = model +"<br><br>============================End of Prisma Client===========================================<br>"
        
        let validate = "<br><br>import Joi from \"joi\";<br><br>"
        validate = validate +"const create"+namaModel+"Validation = Joi.object({"
        result.forEach(element => {
            validate = validate+"<br>&nbsp;&nbsp;"+ element.namaKolom+" : Joi."
            if (element.tipe === "Varchar") {
                validate = validate+"string().max("+element.panjang+")"
                if (element.notNull === "Y") {
                    validate = validate+".required(),"
                }
                if (element.notNull === "N") {
                    validate = validate+".optional(),"
                }
            }

            
        });
        validate = validate+"<br>});<br><br>"


       
        validate = validate +"const update"+namaModel+"Validation = Joi.object({"
        result.forEach(element => {
            validate = validate+"<br>&nbsp;&nbsp;"+ element.namaKolom+" : Joi."
            if (element.tipe === "Varchar") {
                validate = validate+"string().max("+element.panjang+")"
                if (element.notNull === "Y") {
                    validate = validate+".required(),"
                }
                if (element.notNull === "N") {
                    validate = validate+".optional(),"
                }
            }
        });
        validate = validate+"<br>});<br><br>"
       
        validate = validate+"<br>const get"+namaModel+"Validation = Joi.number().positive().required();// engga pake object,pake ID<br><br>"

        

        validate = validate +"const search"+namaModel+"Validation = Joi.object({<br>"+
                    "&nbsp;&nbsp;page: Joi.number().min(1).positive().default(1),<br>"+
                    "&nbsp;&nbsp;size: Joi.number().min(1).positive().max(100).default(10),"
        result.forEach(element => {
            validate = validate+"<br>&nbsp;&nbsp;"+ element.namaKolom+" : Joi."
            if (element.tipe === "Varchar") {
                validate = validate+"string().max("+element.panjang+")"
                if (element.notNull === "Y") {
                    validate = validate+".required(),"
                }
                if (element.notNull === "N") {
                    validate = validate+".optional(),"
                }
            }
        });
        validate = validate+"<br>});<br><br>"

        validate = validate+"export {<br>"+
        "&nbsp;&nbsp;create"+namaModel+"Validation,<br>"+
        "&nbsp;&nbsp;get"+namaModel+"Validation,<br>"+
        "&nbsp;&nbsp;update"+namaModel+"Validation,<br>"+
        "&nbsp;&nbsp;search"+namaModel+"Validation,<br>}"

        validate = validate+"<br><br>============================End of Validation===========================================<br>"
        


        let space = "&nbsp;&nbsp;"
        let space2 = space+space+space+space+space+space+space+space;
        let service = "<br><br>import { prismaClient } from \"../application/database.js\";<br>"+
        "import { logger } from \"../application/logging.js\";<br>"+
        "import { ResponseError } from \"../error/response-error.js\";<br>"+
        "import { validat } from \"../validation/validation.js\";<br>"+
        "import { create"+namaModel+"Validation, get"+namaModel+"Validation ,update"+namaModel+"Validation,search"+namaModel+"Validation} from \"../validation/"+namaModelOri+"-validation.js\";<br><br>"

        service = service + "const create = async (user,request)=>{<br>"+
        "const "+namaModelOri+" = validat(create"+namaModel+"Validation,request);<br>"+
        "// /*"+space + namaModelOri+".username = user.username;*/<br>"+
        space + "return prismaClient."+namaModelOri+".create({<br>"+
        space + space + "data: "+namaModelOri+",<br>"+
        space + space + "select:{<br> id: true,<br>";

        result.forEach(element => {
            if(element.createResponseSukses ==="Y"){
                service = service + space2+space+element.namaKolom+ " : true, <br>"
            }
        });

        service = service + space2+"   }<br>"+
        space+"})<br>"+"}<br><br><br>"

// =========================get================
        service = service +
        "const get = async(user,"+namaModelOri+"Id)=>{<br>"+
        space+namaModelOri+"Id = validat(get"+namaModel+"Validation,"+namaModelOri+"Id);<br>"+
        space+"const "+namaModelOri+" = await prismaClient."+namaModelOri+".findFirst({<br>"+
        space+"where :{<br>"+
        space2+"// /*username : user.username,*/<br>"+
        space2+"id : "+namaModelOri+"Id<br>"+
        space+"},<br>"+
        space+"select: {<br> id:true,<br>"

        result.forEach(element => {
            if(element.getResponse ==="Y"){
                service = service + space2+space+element.namaKolom+ " : true, <br>"
            }
        });

        service = service + space2+"   }<br>"+
        space+"})<br>"+
        space+"if (!"+namaModelOri+") {<br>"+
        space2+"throw new ResponseError(404, \""+namaModelOri+" is not found\");<br>"+
        space+"}<br>"+
        space+"logger.info("+namaModelOri+");<br>"+
        space+"return "+namaModelOri+";<br>}<br><br>"

// ======================================UPDATE=====================
        service = service+
        "const update = async (user,request)=>{<br>"+
        space+"const "+namaModelOri+" = validat(update"+namaModel+"Validation,request);<br>"+
        
        space+"const total"+namaModel+"InDatabase = await prismaClient."+namaModelOri+".count({<br>"+
        space+space+"where :{<br>"+
        space2+"// /*username: user.username,*/<br>"+
        space2+"id : "+namaModelOri+".id<br>"+        
        space2+"}<br>"+
        space+space+"});<br>"+
        space+"if (total"+namaModel+"InDatabase !== 1){<br>"+
        space2+"throw new ResponseError(404,'"+namaModel+" is not found');<br>"+
        space+"}<br>"+
        space+"return prismaClient."+namaModelOri+".update({<br>"+
        space+"where :{<br>"+
        space2+"id : "+namaModelOri+".id<br>"+
        space2+"},<br>"+
        space+"data :{<br>"
        result.forEach(element => {
                service = service + space2+space+element.namaKolom+ " : "+namaModelOri+"."+element.namaKolom+",<br>"
        });
        service = service +space2+"},<br>"+ "select: {<br>";
        result.forEach(element => {
            if(element.updateResponseSukses ==="Y"){
                service = service + space2+space+element.namaKolom+ " : true, <br>"
            }
        });

        service = service +space2+"}<br>"
        service = service +space+"})<br>"+"}<br><br>"


       
        let service2 =  
        "const remove = async (user,"+namaModelOri+"Id)=>{<br>"+
        space+""+namaModelOri+"Id = validat(get"+namaModel+"Validation,"+namaModelOri+"Id);<br>"+
        space+"const totalInDatabase = await prismaClient."+namaModelOri+".count({<br>"+
        space+"where :{<br>"+
        space2+"// /* username : user.username,*/<br>"+
        space2+"id : "+namaModelOri+"Id<br>"+
        space2+"}<br>"+
        space+"});<br>"+
        
        space+"if(totalInDatabase !==1 ){<br>"+
        space2+"throw new ResponseError(404,\""+namaModel+" is not found\");<br>"+
        space+"}<br>"+
        
        space+"return prismaClient."+namaModelOri+".delete({<br>"+
        space+"where : {<br>"+
        space2+"id : "+namaModelOri+"Id<br>"+
        space2+"}<br>"+
        space+"})<br>"+            
        space+"}<br><br>"

        service2 = service2 +
        "const search = async (user, request) => {<br>"+
        space+"request = validat(search"+namaModel+"Validation, request);<br>"+        
        space+"// 1 ((page - 1) * size) = 0<br>"+
        space+"// 2 ((page - 1) * size) = 10<br>"+
        space+"const skip = (request.page - 1) * request.size;<br>"+        
        space+"const filters = [];<br>"+        
        space+"filters.push({<br>"+
        space2+"// /*username: user.username*/<br>"+
        space+"})<br>";
       

       
        result.forEach(element => {
            service2 = service2 +
            space+"if (request."+element.namaKolom+") { <br>"+
            space2+"filters.push({<br>"+
            space2+space2+element.namaKolom+" :{<br>"+
            space2+space2+space2+"contains : request."+element.namaKolom+
            "<br>"+space2+space2+"}<br>"+space2+"});<br>"+space+"}<br>"
        });


        service2 = service2 +
        space+"const "+namaModelOri+" = await prismaClient."+namaModelOri+".findMany({<br>"+
        space2+"where: {<br>"+
        space2+space2+"AND: filters<br>"+
        space2+"},<br>"+
        space2+"take: request.size,<br>"+
        space2+"skip: skip<br>"+
        space+"});<br>"

        service2 = service2 +
        space+"const totalItems = await prismaClient."+namaModelOri+".count({<br>"+
        space2+"where: {<br>"+
        space2+space2+"AND: filters<br>"+
        space2+"}<br>"+
        space+"});<br>"
        service2 = service2 +
        space+"return {<br>"+
        space2+"data: "+namaModelOri+",<br>"+
        space2+"paging: {<br>"+
        space2+space2+"page: request.page,<br>"+
        space2+space2+"total_item: totalItems,<br>"+
        space2+space2+"total_page: Math.ceil(totalItems / request.size)<br>"+
        space2+"}<br>"+
        space+"}<br>"+
        "}<br>"

        service2 = service2 +"<br><br>"+
        "export default {<br>"+
        space2+"create,<br>"+
        space2+"get,<br>"+
        space2+"update,<br>"+
        space2+"remove,<br>"+
        space2+"search<br>"+
        "}<br><br><br>"+"============================End Of Service============<br>"



        // ======================================Controller====================================
        let control =
        "import "+namaModelOri+"Service from \"../service/"+namaModelOri+"-service.js\";<br>"+

        "const create  = async(req,res,next)=>{<br>"+
        space2+"try {<br>"+
        space2+space2+"const user = req.user;<br>"+
        space2+space2+"const request = req.body;<br>"+
        space2+space2+"const result = await "+namaModelOri+"Service.create(user,request);<br>"+
        space2+space2+" res.status(200).json({<br>"+
        space2+space2+"data : result<br>"+
        space2+space2+"})<br>"+
        space2+"} catch (e) {<br>"+
        space2+space2+"next(e)<br>"+
        space2+"}<br>"+
        "};<br>"

        control = control +
        "const get = async (req, res, next) => { <br> "+
        space2+"try {<br> "+
        space2+space2+"const user = req.user;<br> "+
        space2+space2+"const "+namaModelOri+"Id = req.params."+namaModelOri+"Id;<br> "+
        space2+space2+"const result = await "+namaModelOri+"Service.get(user, "+namaModelOri+"Id);<br> "+
        space2+space2+"res.status(200).json({<br> "+
        space2+space2+space2+"data: result<br> "+
        space2+space2+"})<br> "+
        space2+"} catch (e) {<br> "+
        space2+space2+"next(e);<br> "+
        space2+"}<br> "+
        "} <br>"+
        
        "const update = async(req, res, next)=>{<br> "+
        space2+"try {<br> "+
        space2+space2+"const user = req.user;<br> "+
        space2+space2+"const "+namaModelOri+"Id = req.params."+namaModelOri+"tId;<br> "+
        space2+space2+"const request = req.body;<br> "+
        space2+space2+"request.id = "+namaModelOri+"Id;<br> "+
        space2+space2+"const result = await "+namaModelOri+"Service.update(user,request);<br> "+
        space2+space2+"res.status(200).json({<br> "+
        space2+space2+space2+"data : result<br> "+
        space2+space2+"})<br> "+
                
        space2+"} catch (e) {<br> "+
        space2+space2+"next(e);<br> "+
        space2+"}<br> "+
        "}<br> "+
        "const remove = async(req,res,next)=>{<br> "+
        space2+"try {<br> "+
        space2+space2+"const user = req.user;<br> "+
        space2+space2+"const contactId = req.params.contactId;<br> "+
        space2+space2+"await contactService.remove(user,contactId);<br> "+
        space2+space2+"res.status(200).json({<br> "+
        space2+space2+space2+"data : \"OK\"<br> "+
        space2+space2+"})<br> "+            
        space2+"} catch (e) {<br> "+
        space2+space2+"next(e)<br> "+
        space2+"}<br> "+
        "}<br>"+

        "const search = async (req, res, next) => {<br> "+
        space2+"try {<br> "+
        space2+space2+"const user = req.user;<br> "+
        space2+space2+"const request = {<br> "

        result.forEach(element => {
            control = control + space2+space2+space2+element.namaKolom+": req.query."+element.namaKolom+",<br> "
        });

        control = control +
        space2+space2+space2+"page: req.query.page,<br> "+
        space2+space2+space2+"size: req.query.size<br> "+
        space2+space2+"};<br> "+
    
        space2+space2+"const result = await contactService.search(user, request);<br> "+
        space2+space2+"res.status(200).json({<br> "+
        space2+space2+space2+"data: result.data,<br> "+
        space2+space2+space2+"paging: result.paging<br> "+
        space2+space2+"});<br> "+
        space2+"} catch (e) {<br> "+
        space2+space2+"next(e);<br> "+
        space2+"}<br> "+
        "}<br> <br>"+
        "export default {"+
        space2+"create,<br> "+
        space2+"get,<br> "+
        space2+"update,<br> "+
        space2+"remove,<br> "+
        space2+"search<br> "+
        "} <br> "

        control = control + "============================end of controller=================<br><br>"
        control = control + "============================Begin Test=================<br><br>"

        let test =""+
        "import supertest from \"supertest\";<br> "+
        "import { web } from \"../application/web.js\"<br> "+
        "import { logger } from \"../application/logging.js\";<br> "+
        "import { prismaClient } from \"../application/database.js\"<br>"+
        "import { createTestUser,removeTestUser/*,removeAllTestContacts,createTestContact,getTestContact,createManyTestContacts */} from \"./util.test.js\";;<br> "+
        "describe('POST /api/"+namaModelOri+"s', () => {<br>" +
        " beforeEach(async () => {<br>" +
            "await createTestUser();<br>" +
        "});<br>" +
        "afterEach(async () => {<br>" +
            "// /*await removeAllTestContacts();*/<br>" +
            "await removeTestUser();<br>" +
            "await prismaClient."+namaModelOri+".deleteMany({<br>" +
                "where : {<br>" +
                    "//username : \"test\"<br>" 
                    result.forEach(element => {
                        test = test +element.namaKolom+" : \"test\",<br>"
                    });
                    test = test +
                "}"+
            "})<br>" +
        "});<br>" +
        "it('it should can create new "+namaModelOri+"',async () => {<br>" +
            "const result = await supertest(web)<br>" +
            ".post('/api/"+namaModelOri+"s')<br>" +
            ".set('Authorization', 'test')<br>" +
            ".send({<br>" 

            result.forEach(element => {
                test = test +element.namaKolom+" : \"test\",<br>"
            });
           

            test = test + "});<br>" +
            "logger.info(result);<br>"+
            "expect(result.status).toBe(200);<br>" +
            "expect(result.body.data.id).toBeDefined();<br>" 
            
            result.forEach(element => {
                test = test +"expect(result.body.data."+element.namaKolom+").toBe(\"test\");<br>" 
            });

            test = test +
            "});<br>" 


            // create not valid
            test = test +
            "it('it should reject if request is not valid',async () => {<br>" +
                "const result = await supertest(web)<br>" +
                ".post('/api/"+namaModelOri+"s')<br>" +
                ".set('Authorization', 'test')<br>" +
                ".send({<br>" 
                result.forEach(element => {
                    test = test +element.namaKolom+" : \"\",<br>"
                });
                test = test +
                "});<br>" +        
                "logger.info(result.body);<br>" +
                "expect(result.status).toBe(400);<br>" +
                "expect(result.body.errors).toBeDefined();<br>" +               
            "});<br>" +

            "});<br>" 
            test = test +

            "describe('GET /api/"+namaModelOri+"s/:"+namaModelOri+"Id', function () {<br>" +
            "beforeEach(async () => {<br>" +
                "await createTestUser();<br>" +
                "// /*await createTestContact();*/<br>" +
                "await prismaClient."+namaModelOri+".create({<br>" +
                    "data: {<br>" 
                
                    result.forEach(element => {
                        test = test + element.namaKolom+" : \"test\",<br>"
                    });                        
                    
                test = test +
                    "}<br>" +
                "})<br>" +
                "})<br>" +
            
                "afterEach(async () => {<br>" +
                    "//await removeAllTestContacts();<br> " +
                    "await prismaClient."+namaModelOri+".deleteMany({<br> " +
                        "where : {<br> " +
                            "XXXXXXX : \"test\"<br> " +
                        "}<br> " +
                    "})<br> " +
                    "await removeTestUser();<br>" +
                "})<br>" +
            
                "it('should can get "+namaModelOri+"', async () => {<br>" +
                    "const test"+namaModel+" = await prismaClient."+namaModelOri+".findFirst({"+"<br>" +
                    "where: { XXXXXXX: \"test\" }})<br>"+

                    
            
                    "const result = await supertest(web)<br>" +
                        ".get(\"/api/"+namaModelOri+"s/\" + test"+namaModel+".id)<br>" +
                        ".set('Authorization', 'test');<br>" +           
                 
            
                    "expect(result.status).toBe(200);<br>" +
                    "expect(result.body.data.id).toBe(test"+namaModel+".id);<br>" 
   
                    result.forEach(element => {
                        test = test + "expect(result.body.data."+element.namaKolom+").toBe(test"+namaModel+"."+element.namaKolom+");<br>" 
                    });

                    test = test +

                    // "expect(result.body.data.last_name).toBe(test"+namaModelOri+".last_name);<br>" +
                    // "expect(result.body.data.email).toBe(testContact.email);<br>" +
                    // "expect(result.body.data.phone).toBe(testContact.phone);<br>" +
                "});<br>" 
        test = test +"});<br>"

        test = test +"==============================END OF TEST=========================<br>"

        let route = "import "+namaModelOri+"Controller from \"../controller/"+namaModelOri+"-controller.js\";<br><br><br><br>"+
        "userRouter.post('/api/"+namaModelOri+"s',"+namaModelOri+"Controller.create);<br>" +
        "userRouter.get('/api/"+namaModelOri+"s/:"+namaModelOri+"Id', "+namaModelOri+"Controller.get);<br>" +
        "userRouter.put('/api/"+namaModelOri+"s/:"+namaModelOri+"Id', "+namaModelOri+"Controller.update);<br>" +
        "userRouter.delete('/api/"+namaModelOri+"s/:"+namaModelOri+"Id', "+namaModelOri+"Controller.remove);<br>" +
        "userRouter.get('/api/"+namaModelOri+"s', "+namaModelOri+"Controller.search);<br>" 

        route = route +"==============================END OF ROUTE=========================<br>"

        let doskoman ="<br><br><br><br>===============CREATE FILE=============== <br>"+
        "type nul > src/validation/"+namaModelOri+"-validation.js <br>"+
        "type nul > src/service/"+namaModelOri+"-service.js <br>"+
        "type nul > src/controller/"+namaModelOri+"-controller.js <br>"+
        "type nul > src/test/"+namaModelOri+".test.js <br> dir<br>";
        
        res.status(200).send(control+model+validate+service+service2+test+route+doskoman)
    } catch (e) {
        next(e);
    }
}

export default{
    get
}