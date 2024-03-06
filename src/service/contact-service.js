import { prismaClient } from "../application/database";
// import { logger } from "../application/logging";
// import { ResponseError } from "../error/response-error";
import { createContactValidation } from "../validation/contact-validation";
import { validat } from "../validation/validation";

const create = async (user,request)=>{
    const contact = validat(createContactValidation,request);
    contact.username = user.username;
    return prismaClient.contact.create({
        data: contact,
        select:{
            id : true,
            first_name: true,
            last_name: true,
            phone: true,
            email: true
        }
    })

}



export default {
    create
}