import { prismaClient } from "../application/database"
import  bcript from "bcrypt";

export const removeTestUser = async()=>{
    await prismaClient.user.deleteMany({
        where : {
            username : "test"
        }
    })
}

export const createTestUser = async()=>{
    await prismaClient.user.create({
        data :{
            username : "test",
            password : await bcript.hash("test",10),
            name : "test",
            token : "test"
        }
    })
}

export const getTestUser = async () => {
    return prismaClient.user.findUnique({
        where: {
            username: "test"
        }
    });
}

export const removeAllTesContact = async()=>{
    await prismaClient.contact.deleteMany({
        where : {
            username : "test"
        }
    })
}
