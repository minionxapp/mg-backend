//============================VALIDATE====================

import Joi from "joi";

const createBankValidation = Joi.object({
  kode : Joi.string().max(4).required(),
  nama : Joi.string().max(50).required(),
  jenis : Joi.string().max(20).required(),
  status : Joi.string().max(2).required(),
});

const updateBankValidation = Joi.object({
id : Joi.number().positive().required(),
  kode : Joi.string().max(4).required(),
  nama : Joi.string().max(50).required(),
  jenis : Joi.string().max(20).required(),
  status : Joi.string().max(2).required(),
});


const getBankValidation = Joi.number().positive().required();// engga pake object,pake ID

const searchBankValidation = Joi.object({
  page: Joi.number().min(1).positive().default(1),
  size: Joi.number().min(1).positive().max(100).default(10),
  kode : Joi.string().max(4).optional(),
  nama : Joi.string().max(50).optional(),
  jenis : Joi.string().max(20).optional(),
  status : Joi.string().max(2).optional(),
});

export {
  createBankValidation,
  getBankValidation,
  updateBankValidation,
  searchBankValidation,
}