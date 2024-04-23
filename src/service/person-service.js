

//================================================Begin Of Service============================


import { prismaClient } from "../application/database.js";
import { logger } from "../application/logging.js";
import { ResponseError } from "../error/response-error.js";
import { validat } from "../validation/validation.js";
import { createPersonValidation, getPersonValidation, updatePersonValidation, searchPersonValidation } from "../validation/person-validation.js";

const create = async (user, request) => {
    const person = validat(createPersonValidation, request);
    person.createBy = user.username;
    return prismaClient.person.create({
        data: person,
        select: {
            id: true,
            nama: true,
            alamat: true,
            nik: true,
        }
    })
}


const get = async (user, personId) => {
    const person = validat(getPersonValidation, personId);
    const Person = await prismaClient.person.findFirst({
        where: {
            id: person.Id
        },
        select: {
            id: true,
            nama: true,
            alamat: true,
            nik: true,
        }
    })
    if (!Person) {
        throw new ResponseError(404, "person is not found");
    }
    logger.info(person);
    return Person;
}

const update = async (user, request) => {
    const person = validat(updatePersonValidation, request);
    person.updateBy = user.username;
    const totalPersonInDatabase = await prismaClient.person.count({
        where: {
            // /*createBy: user.username,*/
            id: person.id
        }
    });
    if (totalPersonInDatabase !== 1) {
        throw new ResponseError(404, 'Person is not found');
    }
    return prismaClient.person.update({
        where: {
            id: person.id
        },
        data: {
            updateBy: user.username,
            nama: person.nama,
            alamat: person.alamat,
            nik: person.nik,
        },
        select: {
            nama: true,
            alamat: true,
            nik: true,
        }
    })
}

const remove = async (user, personId) => {
    personId = validat(getPersonValidation, personId);
    const totalInDatabase = await prismaClient.person.count({
        where: {
            // /* username : user.username,*/
            id: personId
        }
    });
    if (totalInDatabase !== 1) {
        throw new ResponseError(404, "Person is not found");
    }
    return prismaClient.person.delete({
        where: {
            id: personId
        }
    })
}

const search = async (user, request) => {
    request = validat(searchPersonValidation, request);
    // 1 ((page - 1) * size) = 0
    // 2 ((page - 1) * size) = 10
    const skip = (request.page - 1) * request.size;
    const filters = [];
    // filters.push({
    //     createBy: user.username
    // })
    if (request.nama) {
        filters.push({
            nama: {
                contains: request.nama
            }
        });
    }
    if (request.alamat) {
        filters.push({
            alamat: {
                contains: request.alamat
            }
        });
    }
    if (request.nik) {
        filters.push({
            nik: {
                contains: request.nik
            }
        });
    }

    const person = await prismaClient.person.findMany({
        where: {
            AND: filters
        },
        take: request.size,
        skip: skip
    });
    const totalItems = await prismaClient.person.count({
        where: {
            AND: filters
        }
    });
    return {
        data: person,
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


//====End Of SERVICE===