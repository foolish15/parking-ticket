import { Repository as ParkingLotRepo } from '../repositories/parking-lot'
import { Repository as TicketRepo } from '../repositories/ticket'
import { Ticket, CarSize } from '../schemas/ticket'
import { ParkingLotStatus } from '../schemas/parking-lot'
import { db } from '../util/db'

export interface Service {
    issueTicket(carPlate: string, carSize: CarSize): Promise<Ticket>
    checkout(ticketId: number): Promise<Ticket>
}

export class Parking implements Service {
    private ticketRepo: TicketRepo
    private parkinkLotRepo: ParkingLotRepo

    constructor(ticketRepo: TicketRepo, parkinkLotRepo: ParkingLotRepo) {
        this.ticketRepo = ticketRepo
        this.parkinkLotRepo = parkinkLotRepo
    }

    public async issueTicket(carPlate: string, carSize: CarSize): Promise<Ticket> {
        const listAvaliableLot = await this.parkinkLotRepo.list(db, ParkingLotStatus.AVAILABLE)
        if (listAvaliableLot.length === 0) {
            throw new Error("Parking lot are full");
        }
        const chooseLot = listAvaliableLot[0]
        try {
            return await db.transaction(async (trx) => {
                let parkingLot = await this.parkinkLotRepo.findById(trx, chooseLot.id, true) // lock for update
                if (parkingLot.status === ParkingLotStatus.INUSED) {
                    throw new Error("Parking lot are full");
                }

                const ticket = await this.ticketRepo.create(trx, carPlate, carSize, parkingLot.id) // create ticket

                parkingLot = await this.parkinkLotRepo.updateStatus(trx, parkingLot.id, ParkingLotStatus.INUSED) // update parking lot to in-used
                return {
                    "id": ticket.id,
                    "carPlateNo": ticket.carPlateNo,
                    "carSize": ticket.carSize,
                    "parkingLotId": ticket.parkingLotId,
                    "isCheckout": ticket.isCheckout,
                    "parkingLot": parkingLot,
                }
            })
        } catch (err) {
            throw new Error(err);
        }
    }

    public async checkout(ticketId: number): Promise<Ticket> {
        try {
            return await db.transaction(async (trx) => {
                let ticket = await this.ticketRepo.findById(trx, ticketId, true) // lock for update
                const parkingLot = await this.parkinkLotRepo.findById(trx, ticket.parkingLotId, true) // lock for update
                await this.parkinkLotRepo.updateStatus(trx, parkingLot.id, ParkingLotStatus.AVAILABLE) // update parking lot to available
                ticket = await this.ticketRepo.checkout(trx, ticket.id) // checkout ticket
                return {
                    "id": ticket.id,
                    "carPlateNo": ticket.carPlateNo,
                    "carSize": ticket.carSize,
                    "parkingLotId": ticket.parkingLotId,
                    "isCheckout": ticket.isCheckout,
                }
            })
        } catch (err) {
            throw new Error(err);
        }
    }

}