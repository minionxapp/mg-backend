// ===============SERVICE CREATE====
import { prismaClient } from "../application/database.js";
import { logger } from "../application/logging.js";
import { ResponseError } from "../error/response-error.js";
import { validat } from "../validation/validation.js";
import { createBankValidation, getBankValidation, updateBankValidation, searchBankValidation } from "../validation/bank-validation.js";

const create = async (user, request) => {
    const bank = validat(createBankValidation, request);
    bank.createBy = user.username;
    return prismaClient.bank.create({
        data: bank,
        select: {
            id: true,
            kode: true,
            nama: true,
            jenis: true,
            status: true,
        }
    })
}


//===============SERVICE GET====
const get = async (user, bankId) => {
    const bank = validat(getBankValidation, bankId);
    const Bank = await prismaClient.bank.findFirst({
        where: {
            id: bank.Id
        },
        select: {
            id: true,
            kode: true,
            nama: true,
            jenis: true,
            status: true,
        }
    })
    if (!Bank) {
        throw new ResponseError(404, "bank is not found");
    }
    logger.info(bank);
    return Bank;
}

//===============SERVICE UPDATE=====================
const update = async (user, request) => {
    const bank = validat(updateBankValidation, request);
    bank.updateBy = user.username;
    const totalBankInDatabase = await prismaClient.bank.count({
        where: {
            // /*createBy: user.username,*/
            id: bank.id
        }
    });
    if (totalBankInDatabase !== 1) {
        throw new ResponseError(404, 'Bank is not found');
    }
    return prismaClient.bank.update({
        where: {
            id: bank.id
        },
        data: {
            updateBy: user.username,
            kode: bank.kode,
            nama: bank.nama,
            jenis: bank.jenis,
            status: bank.status,
        },
        select: {
            kode: true,
            nama: true,
            jenis: true,
            status: true,
        }
    })
}

//===============SERVICE REMOVE=====================
const remove = async (user, bankId) => {
    bankId = validat(getBankValidation, bankId);
    const totalInDatabase = await prismaClient.bank.count({
        where: {
            // /* username : user.username,*/
            id: bankId
        }
    });
    if (totalInDatabase !== 1) {
        throw new ResponseError(404, "Bank is not found");
    }
    return prismaClient.bank.delete({
        where: {
            id: bankId
        }
    })
}

//===============SERVICE SEARCH=====================
const search = async (user, request) => {
    request = validat(searchBankValidation, request);
    // 1 ((page - 1) * size) = 0
    // 2 ((page - 1) * size) = 10
    const skip = (request.page - 1) * request.size;
    const filters = [];
    filters.push({
        // /*username: user.username*/
    })
    if (request.kode) {
        filters.push({
            kode: {
                contains: request.kode
            }
        });
    }
    if (request.nama) {
        filters.push({
            nama: {
                contains: request.nama
            }
        });
    }
    if (request.jenis) {
        filters.push({
            jenis: {
                contains: request.jenis
            }
        });
    }
    if (request.status) {
        filters.push({
            status: {
                contains: request.status
            }
        });
    }
    const bank = await prismaClient.bank.findMany({
        where: {
            AND: filters
        },
        take: request.size,
        skip: skip
    });
    const totalItems = await prismaClient.bank.count({
        where: {
            AND: filters
        }
    });
    return {
        data: bank,
        paging: {
            page: request.page,
            total_item: totalItems,
            total_page: Math.ceil(totalItems / request.size)
        }
    }
}


export default {
    create,
    get,
    update,
    remove,
    search
}