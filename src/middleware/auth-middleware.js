import { prismaClient } from "../application/database.js";
// import { log ger } from "../application/logging.js";

/*
akan mngecek semua request, dengan memeriksan parameter token yang dikirimkan pada  Authorization
bila semua valid, maka pada req (request) akan di tambahkan parameter user yang berupa object
yang di ambil dari database/table users
1. cari user berdasarkan param token
2. bila di temukan tambahkan req dengan object user
*/
export const authMiddleware =async (req,res,next)=>{
    const token = req.get('Authorization');
    if(!token){
        res.status(401).json({
            errors : "Unauthorized"
        }).end();
    }else{
        const user = await prismaClient.user.findFirst({
            where :{
                token : token
            }
        });
        if(!user){
            res.status(401).json({
                errors : "Unauthorized"
            }).end();
        }else{
            req.user = user;
            next();
        }
    }

}