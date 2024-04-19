import { prismaClient } from "../application/database.js";
import { logger } from "../application/logging.js";
import { ResponseError } from "../error/response-error.js";

const search = async (tableName) => {
    const koloms = await prismaClient.table.findMany({
        where: {
            namaTable : tableName,
        }
    });

    logger.info(koloms);
    if (!koloms) {
        throw new ResponseError(404, "contact is not found");
    }
    return koloms;
}

export default{
    search
}