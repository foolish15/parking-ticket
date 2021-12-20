import { RequestHandler } from "express"
import { ParkingLotRepo } from '../repositories/parking-lot'
import { db } from '../util/db'

export const create: RequestHandler = async (req, res, next) => {
    const label: string = req.body.label
    const repo = new ParkingLotRepo()
    const promiseCount = await repo.countWhereLabel(db, label)
    if (promiseCount > 0) {
        return res.status(422).json({
            errors: [
                {
                    value: label,
                    msg: "Duplicate",
                    param: "label",
                    location: "body"
                }
            ]
        })
    }
    const rsl = await repo.create(db, label)
    return res.status(201).json(rsl)
};
export const index: RequestHandler = async (req, res, next) => {
    const repo = new ParkingLotRepo()
    const pkl = await repo.findById(db, +req.params.id)
    if (typeof pkl === 'undefined') {
        return res.status(404).json({
            value: req.params.id,
            msg: "Notfound",
            param: "id",
            location: "params"
        })
    }
    return res.status(200).json(pkl)
};
export const list: RequestHandler = async (req, res, next) => {
    const repo = new ParkingLotRepo()
    const status: any = req.query.status
    const carSize: any = req.query.carSize
    const rsl = await repo.list(db, status, carSize)
    return res.status(200).json(rsl)
};
// export const update: RequestHandler = (req, res, next) => {
//     res.status(201)
// };
// export const remove: RequestHandler = (req, res, next) => {
//     res.status(201)
// };