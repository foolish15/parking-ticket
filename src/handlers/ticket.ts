import { RequestHandler } from "express"
import { CarSize } from '../schemas/ticket'
import { ParkingLotRepo } from '../repositories/parking-lot'
import { TicketRepo } from '../repositories/ticket'
import { Parking } from '../services/parking'
import { db } from '../util/db'

export const create: RequestHandler = async (req, res, next) => {
    const parkingRepo = new ParkingLotRepo()
    const ticketRepo = new TicketRepo()
    const parkingSv = new Parking(ticketRepo, parkingRepo)
    const ticket = await parkingSv.issueTicket(req.body.carPlate, req.body.carSize)
    res.status(201).json(ticket)
};
export const checkout: RequestHandler = async (req, res, next) => {
    const parkingRepo = new ParkingLotRepo()
    const ticketRepo = new TicketRepo()
    const parkingSv = new Parking(ticketRepo, parkingRepo)
    const ticket = await parkingSv.checkout(+req.params.id)
    res.status(201).json(ticket)
};
export const list: RequestHandler = async (req, res, next) => {
    const carSize: any = req.query.carSize
    const ticketRepo = new TicketRepo()
    const tks = await ticketRepo.list(db, carSize)
    res.status(200).json(tks)
};