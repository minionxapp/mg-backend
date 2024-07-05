//===============Controller Create (POST)=====================
import bankService from "../service/bank-service.js";
const create = async (req, res, next) => {
    try {
        const user = req.user;
        const request = req.body;
        const result = await bankService.create(user, request);
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e)
    }
};

//===============Controller GET=====================
const get = async (req, res, next) => {
    try {
        const user = req.user;
        const bankId = req.params.bankId;
        const result = await bankService.get(user, bankId);
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e);
    }
}

//===============Controller UPDATE (PUT)=====================
const update = async (req, res, next) => {
    try {
        const user = req.user;
        const bankId = req.params.bankId;
        const request = req.body;
        request.id = bankId;
        const result = await bankService.update(user, request);
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e);
    }
}
// ===============Controller Remove (REMOVE)=====================
const remove = async (req, res, next) => {
    try {
        const user = req.user;
        const bankId = req.params.bankId;
        await bankService.remove(user, bankId);
        res.status(200).json({
            data: "OK"
        })
    } catch (e) {
        next(e)
    }
}
//===============Controller Search (GET)=====================
const search = async (req, res, next) => {
    try {
        const user = req.user;
        const request = {
            kode: req.query.kode,
            nama: req.query.nama,
            jenis: req.query.jenis,
            status: req.query.status,
            page: req.query.page,
            size: req.query.size
        };
        const result = await bankService.search(user, request);
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