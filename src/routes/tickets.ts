import { Router, Request, Response, NextFunction } from "express"
import { body,query, param, validationResult } from 'express-validator';
import * as TicketHandler from '../handlers/ticket'

const router = Router()

router.get(
    "/",
    [
        query('carSize').trim().toLowerCase().isIn(['small', 'medium', 'large'])
    ],
    TicketHandler.list
)
router.post(
    "/",
    [
        body('carPlate').trim().not().isEmpty(),
        body('carSize').trim().toLowerCase().not().isEmpty().isIn(['small', 'medium', 'large'])
    ],
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        next()
    },
    TicketHandler.create
)
router.post(
    "/:id/checkout",
    [
        param('id').trim().toInt().isNumeric(),
    ],
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        next()
    },
    TicketHandler.checkout
)

export default router