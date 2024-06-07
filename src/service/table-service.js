import { prismaClient } from "../application/database.js";
import { logger } from "../application/logging.js";
import { ResponseError } from "../error/response-error.js";


const search = async (tableName) => {
    const koloms = await prismaClient.table.findMany({
        where: {
            namaTable: tableName,
        }
    });

    logger.info(koloms);
    if (!koloms) {
        throw new ResponseError(404, "tableName is not found");
    }
    return koloms;
}


//==================================

import { validat } from "../validation/validation.js";
import { createTableValidation, getTableValidation ,updateTableValidation,searchTableValidation} from "../validation/table-validation.js";

const create = async (user,request)=>{
const table = validat(createTableValidation,request);
//   table.createBy = user.username;
  return prismaClient.table.create({
    data: table,
    select:{
id: true,
                  namaTable : true,
                  namaKolom : true,
                  tipe : true,
                  panjang : true,
                  notNull : true,
                  createRequest : true,
                  createResponseSukses : true,
                  updateRequest : true,
                  updateResponseSukses : true,
                  getRequest : true,
                  getResponse : true,
                  searchRequest : true,
                  searchResponse : true,
                  removeRequest : true,
                  removeResponse : true,
                  testValue : true,
                 }
  })
}


//===============SERVICE GET====
const get = async(user,tableId)=>{
const  table = validat(getTableValidation,tableId);
  const Table = await prismaClient.table.findFirst({
  where :{
                id : table.Id
  },
  select: {
id:true,
                  namaTabel : true,
                  namaKolom : true,
                  tipe : true,
                  panjang : true,
                  notNull : true,
                  createRequest : true,
                  createResponseSukses : true,
                  updateRequest : true,
                  updateResponseSukses : true,
                  getRequest : true,
                  getResponse : true,
                  searchRequest : true,
                  searchResponse : true,
                  removeRequest : true,
                  removeResponse : true,
                  testValue : true,
                 }
  })
  if (!Table) {
                throw new ResponseError(404, "table is not found");
  }
  logger.info(table);
  return Table;
}

//===============SERVICE UPDATE=====================
const update = async (user,request)=>{
  const table = validat(updateTableValidation,request);
table.updateBy = user.username;
  const totalTableInDatabase = await prismaClient.table.count({
    where :{
                // /*createBy: user.username,*/
                id : table.id
                }
    });
  if (totalTableInDatabase !== 1){
                throw new ResponseError(404,'Table is not found');
  }
  return prismaClient.table.update({
  where :{
                id : table.id
                },
  data :{
updateBy: user.username,
                  namaTabel : table.namaTabel,
                  namaKolom : table.namaKolom,
                  tipe : table.tipe,
                  panjang : table.panjang,
                  notNull : table.notNull,
                  createRequest : table.createRequest,
                  createResponseSukses : table.createResponseSukses,
                  updateRequest : table.updateRequest,
                  updateResponseSukses : table.updateResponseSukses,
                  getRequest : table.getRequest,
                  getResponse : table.getResponse,
                  searchRequest : table.searchRequest,
                  searchResponse : table.searchResponse,
                  removeRequest : table.removeRequest,
                  removeResponse : table.removeResponse,
                  testValue : table.testValue,
                },
select: {
                  namaTabel : true,
                  namaKolom : true,
                  tipe : true,
                  panjang : true,
                  notNull : true,
                  createRequest : true,
                  createResponseSukses : true,
                  updateRequest : true,
                  updateResponseSukses : true,
                  getRequest : true,
                  getResponse : true,
                  searchRequest : true,
                  searchResponse : true,
                  removeRequest : true,
                  removeResponse : true,
                  testValue : true,
                }
  })
}

//===============SERVICE REMOVE=====================
const remove = async (user,tableId)=>{
  tableId = validat(getTableValidation,tableId);
  const totalInDatabase = await prismaClient.table.count({
  where :{
                // /* username : user.username,*/
                id : tableId
                }
  });
  if(totalInDatabase !==1 ){
                throw new ResponseError(404,"Table is not found");
  }
  return prismaClient.table.delete({
  where : {
                id : tableId
                }
  })
  }

//===============SERVICE SEARCH=====================
const search2 = async (user, request) => {
  request = validat(searchTableValidation, request);
  // 1 ((page - 1) * size) = 0
  // 2 ((page - 1) * size) = 10
  const skip = (request.page - 1) * request.size;
  const filters = [];
  filters.push({
                // /*username: user.username*/
  })
  if (request.namaTabel) {
                filters.push({
                                namaTabel :{
                                                contains : request.namaTabel
                                }
                });
  }
  if (request.namaKolom) {
                filters.push({
                                namaKolom :{
                                                contains : request.namaKolom
                                }
                });
  }
  if (request.tipe) {
                filters.push({
                                tipe :{
                                                contains : request.tipe
                                }
                });
  }
  if (request.panjang) {
                filters.push({
                                panjang :{
                                                contains : request.panjang
                                }
                });
  }
  if (request.notNull) {
                filters.push({
                                notNull :{
                                                contains : request.notNull
                                }
                });
  }
  if (request.createRequest) {
                filters.push({
                                createRequest :{
                                                contains : request.createRequest
                                }
                });
  }
  if (request.createResponseSukses) {
                filters.push({
                                createResponseSukses :{
                                                contains : request.createResponseSukses
                                }
                });
  }
  if (request.updateRequest) {
                filters.push({
                                updateRequest :{
                                                contains : request.updateRequest
                                }
                });
  }
  if (request.updateResponseSukses) {
                filters.push({
                                updateResponseSukses :{
                                                contains : request.updateResponseSukses
                                }
                });
  }
  if (request.getRequest) {
                filters.push({
                                getRequest :{
                                                contains : request.getRequest
                                }
                });
  }
  if (request.getResponse) {
                filters.push({
                                getResponse :{
                                                contains : request.getResponse
                                }
                });
  }
  if (request.searchRequest) {
                filters.push({
                                searchRequest :{
                                                contains : request.searchRequest
                                }
                });
  }
  if (request.searchResponse) {
                filters.push({
                                searchResponse :{
                                                contains : request.searchResponse
                                }
                });
  }
  if (request.removeRequest) {
                filters.push({
                                removeRequest :{
                                                contains : request.removeRequest
                                }
                });
  }
  if (request.removeResponse) {
                filters.push({
                                removeResponse :{
                                                contains : request.removeResponse
                                }
                });
  }
  if (request.testValue) {
                filters.push({
                                testValue :{
                                                contains : request.testValue
                                }
                });
  }
  const table = await prismaClient.table.findMany({
                where: {
                                AND: filters
                },
                take: request.size,
                skip: skip
  });
  const totalItems = await prismaClient.table.count({
                where: {
                                AND: filters
                }
  });
  return {
                data: table,
                paging: {
                                page: request.page,
                                total_item: totalItems,
                                total_page: Math.ceil(totalItems / request.size)
                }
  }
}







export default {
   
    search,
    create,
    get,
    update,
    remove,
    search2
   
}