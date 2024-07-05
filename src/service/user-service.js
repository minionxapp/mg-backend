
import { prismaClient } from "../application/database.js";
import { logger } from "../application/logging.js";
import { ResponseError } from "../error/response-error.js";
import { validat } from "../validation/validation.js";
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { registerUserValidation, loginUserValidation, getUserValidation, updateUserValidation } from "../validation/user-validation.js";

const register = async (request) => {
    const user = validat(registerUserValidation, request)
    const countUser = await prismaClient.user.count({
        where: {
            username: user.username
        }
    });
    if (countUser === 1) {
        throw new ResponseError(400, 'User already exist');
    }
    user.password = await bcrypt.hash(user.password, 10);
    const result = await prismaClient.user.create({
        data: user,
        select: {
            username: true,
            name: true
        }
    })
    return result;
}


const login = async (request) => {
    const loginRequest = validat(loginUserValidation, request);
    const user = await prismaClient.user.findUnique({
        where: {
            username: loginRequest.username,
            status : "Y"
        },
        select: {
            username: true,
            password: true
        }
    });
    if (!user) {
        throw new ResponseError(401, "Username or password invalid user tidak ditemukan ");
    }
    const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);
    if (!isPasswordValid) {
        throw new ResponseError(401, "Username or password invalid");
    }


    const tokens = uuid().toString();
    logger.info(tokens);
    return prismaClient.user.update({
        data: {
            token: tokens
        },
        where: {
            username: user.username
        },
        select: {
            token: true,
            role :true,
            status :true
        }
    });
}

const get = async (username)=>{
    username = validat(getUserValidation,username);
    const user  = await prismaClient.user.findUnique({
        where :{
            username : username
        },
        select :{
            username : true,
            name : true
        }
    });

    if(!user){
        throw new ResponseError(404,"User Not Found....")
    }
    return user;
}

const update = async(request) =>{
    // cek user sudah terdaftar dalam database, melewati midleware auth-middleware
    const user = validat(updateUserValidation,request);
    
    const totalUserInDatabase = await prismaClient.user.count({
        where :{
            username: user.username
        }
    });
    if(totalUserInDatabase != 1){
        throw new ResponseError(404,'User is not found');
    }

    const data={};
    if(user.name){
        data.name = user.name;
    }
    if(user.password){
        data.password= await bcrypt.hash(user.password,10);
    }

    return  prismaClient.user.update({
        where :{
            username : user.username
        },
        data : data,
        select:{
            username : true,
            name : true
        }
    })
}


const logout = async (username) => {
    username = validat(getUserValidation, username);

    const user = await prismaClient.user.findUnique({
        where: {
            username: username
        }
    });

    if (!user) {
        throw new ResponseError(404, "user is not found");
    }

    return prismaClient.user.update({
        where: {
            username: username
        },
        data: {
            token: null
        },
        select: {
            username: true
        }
    })
}


const ceklogin = async (token) => {
    username = validat(getUserValidation, username);

    const user = await prismaClient.user.findUnique({
        where: {
            token : token
        }
    });

    if (!user) {
        throw new ResponseError(404, "user is not found");
    }
    return user

    // return prismaClient.user.update({
    //     where: {
    //         username: username
    //     },
    //     data: {
    //         token: null
    //     },
    //     select: {
    //         username: true
    //     }
    // })
}



export default {
    register,
    login,
    get,
    update,
    logout,
    ceklogin
}