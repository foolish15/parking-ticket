import { Router, Request, Response, NextFunction } from "express"
import { body, query, param, validationResult } from 'express-validator';
import * as ParkingLotHandler from "../handlers/parking-lot"

const router = Router()

router.post(
    "/",
    [
        body('label').trim().not().isEmpty()
    ], (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        next()
    },
    ParkingLotHandler.create
)
router.get(
    "/",
    [
        query('status').trim().toLowerCase().isIn(['avaliable', 'in-used']),
        query('carSize').trim().toLowerCase().isIn(['small', 'medium', 'large'])
    ],
    ParkingLotHandler.list
)
router.get(
    "/:id",
    [
        param('id').trim().toInt().isNumeric(),
    ],
    ParkingLotHandler.index
)
// router.put("/:id", ParkingLotHandler.update)
// router.delete("/:id", ParkingLotHandler.remove)

export default router