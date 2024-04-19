
  import Joi from "joi";
  
  const createPersonValidation = Joi.object({
    nama : Joi.string().max(20).required(),
    alamat : Joi.string().max(250).optional(),
    nik : Joi.string().max(10).optional(),
  });
  
  const updatePersonValidation = Joi.object({
    nama : Joi.string().max(20).required(),
    alamat : Joi.string().max(250).optional(),
    nik : Joi.string().max(10).optional(),
  });
  
  
  const getPersonValidation = Joi.number().positive().required();// engga pake object,pake ID
  
  const searchPersonValidation = Joi.object({
    page: Joi.number().min(1).positive().default(1),
    size: Joi.number().min(1).positive().max(100).default(10),
    nama : Joi.string().max(20).required(),
    alamat : Joi.string().max(250).optional(),
    nik : Joi.string().max(10).optional(),
  });
  
  export {
    createPersonValidation,
    getPersonValidation,
    updatePersonValidation,
    searchPersonValidation,
  }
  