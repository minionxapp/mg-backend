//===Begin On CONTROLLER===

import { logger } from "../application/logging.js";
import personService from "../service/person-service.js";
const create = async (req, res, next) => {
    logger.info("mulai test create")
    try {
        const user = req.user;
        const request = req.body;
       
        const result = await personService.create(user, request);
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e)
    }
};
const get = async (req, res, next) => {
    try {
        const user = req.user;
        const personId = req.params.personId;
        
        const result = await personService.get(user, personId);
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e);
    }
}
const update = async (req, res, next) => {
    try {
        const user = req.user;
        const personId = req.params.personId;

        const request = req.body;
        request.id = personId;
        const result = await personService.update(user, request);
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e);
    }
}
const remove = async (req, res, next) => {
    try {
        const user = req.user;
        const personId = req.params.personId;
        await personService.remove(user, personId);
        res.status(200).json({
            data: "OK"
        })
    } catch (e) {
        next(e)
    }
}
const search = async (req, res, next) => {
    try {
        const user = req.user;
        const request = {
            nama: req.query.nama,
            alamat: req.query.alamat,
            nik: req.query.nik,
            page: req.query.page,
            size: req.query.size
        };
        
        const result = await personService.search(user, request);
        res.status(200).json({
            data: result.data,
            paging: result.paging
        });
    } catch (e) {
        next(e);
    }
}

export default {
    create,
    get,
    update,
    remove,
    search
}