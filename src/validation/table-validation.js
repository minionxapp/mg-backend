//============================VALIDATE====================

import Joi from "joi";

const createTableValidation = Joi.object({
    namaTable: Joi.string().max(200).required(),
    namaKolom: Joi.string().max(200).required(),
    tipe: Joi.string().max(200).required(),
    panjang: Joi.number().min(1).positive().default(1),
    notNull: Joi.string().max(200).required(),
    createRequest: Joi.string().max(200).required(),
    createResponseSukses: Joi.string().max(200).required(),
    updateRequest: Joi.string().max(200).required(),
    updateResponseSukses: Joi.string().max(200).required(),
    getRequest: Joi.string().max(200).required(),
    getResponse: Joi.string().max(200).required(),
    searchRequest: Joi.string().max(200).required(),
    searchResponse: Joi.string().max(200).required(),
    removeRequest: Joi.string().max(200).required(),
    removeResponse: Joi.string().max(200).required(),
    testValue: Joi.string().max(200).required(),
});

const updateTableValidation = Joi.object({
    id: Joi.number().positive().required(),
    namaTable: Joi.string().max(200).required(),
    namaKolom: Joi.string().max(200).required(),
    tipe: Joi.string().max(200).required(),
    panjang: Joi.string().max(200).required(),
    notNull: Joi.string().max(200).required(),
    createRequest: Joi.string().max(200).required(),
    createResponseSukses: Joi.string().max(200).required(),
    updateRequest: Joi.string().max(200).required(),
    updateResponseSukses: Joi.string().max(200).required(),
    getRequest: Joi.string().max(200).required(),
    getResponse: Joi.string().max(200).required(),
    searchRequest: Joi.string().max(200).required(),
    searchResponse: Joi.string().max(200).required(),
    removeRequest: Joi.string().max(200).required(),
    removeResponse: Joi.string().max(200).required(),
    testValue: Joi.string().max(200).required(),
});


const getTableValidation = Joi.number().positive().required();// engga pake object,pake ID

const searchTableValidation = Joi.object({
    page: Joi.number().min(1).positive().default(1),
    size: Joi.number().min(1).positive().max(100).default(10),
    namaTable: Joi.string().max(200).optional(),
    namaKolom: Joi.string().max(200).optional(),
    tipe: Joi.string().max(200).optional(),
    panjang: Joi.number().min(1).positive().default(1),
    notNull: Joi.string().max(200).optional(),
    createRequest: Joi.string().max(200).optional(),
    createResponseSukses: Joi.string().max(200).optional(),
    updateRequest: Joi.string().max(200).optional(),
    updateResponseSukses: Joi.string().max(200).optional(),
    getRequest: Joi.string().max(200).optional(),
    getResponse: Joi.string().max(200).optional(),
    searchRequest: Joi.string().max(200).optional(),
    searchResponse: Joi.string().max(200).optional(),
    removeRequest: Joi.string().max(200).optional(),
    removeResponse: Joi.string().max(200).optional(),
    testValue: Joi.string().max(200).optional(),
});

export {
    createTableValidation,
    getTableValidation,
    updateTableValidation,
    searchTableValidation,
}