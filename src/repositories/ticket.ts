import { Knex } from 'knex'
import { Ticket, CarSize } from '../schemas/ticket'

export interface Repository {
    findById(db: Knex, id: number, forUpdate?: boolean): Promise<Ticket>
    create(db: Knex, carPlate: string, carSize: CarSize, parkingLotId: number): Promise<Ticket>
    checkout(db: Knex, id: number): Promise<Ticket>
    list(db: Knex, carSize?: CarSize): Promise<Ticket[]>
}

export class TicketRepo implements Repository {
    private table: string

    constructor() {
        this.table = "tickets";
    }

    public async findById(db: Knex, id: number, forUpdate?: boolean): Promise<Ticket> {
        const select = db(this.table)
        .select({
            'id': 'id',
            'carPlateNo': 'car_plate_no',
            'carSize': 'car_size',
            'parkingLotId': 'parking_lot_id',
            'isCheckout': 'is_checkout',
            'createdAt': 'created_at',
            'updatedAt': 'updated_at'
        })
        .where('id', '=', id)
        if (typeof forUpdate !== 'undefined' && forUpdate && db.isTransaction) {
            return await select
            .forUpdate()
            .first()
        }
        return await select.first()
    }
    public async list(db: Knex, carSize?: CarSize): Promise<Ticket[]> {
        const select = db(this.table)
        .select({
            'id': 'id',
            'carPlateNo': 'car_plate_no',
            'carSize': 'car_size',
            'parkingLotId': 'parking_lot_id',
            'isCheckout': 'is_checkout',
            'createdAt': 'created_at',
            'updatedAt': 'updated_at'
        })
        if (typeof carSize !== "undefined" && carSize.toString() !== "") {
            return await select.where('car_size', '=', carSize)
        }
        return await select
    }
    public async create(db: Knex, carPlateNo: string, carSize: CarSize, parkingLotId: number): Promise<Ticket> {
        const timestamp = db.raw('CURRENT_TIMESTAMP');
        return await db(this.table)
            .insert({
                'car_plate_no': carPlateNo,
                'car_size': carSize,
                'parking_lot_id': parkingLotId,
                'is_checkout': false,
                'created_at': timestamp,
                'updated_at': timestamp
            }).then((result) => {
                let insertId: number
                result.forEach((value) => {
                    insertId = value
                })
                return this.findById(db, insertId)
            });
    }
    public async checkout(db: Knex, id: number): Promise<Ticket> {
        const timestamp = db.raw('CURRENT_TIMESTAMP');
        return await db(this.table)
            .where('id', '=', id)
            .update({
                'is_checkout': true,
                'updated_at': timestamp
            }).then(() => {
                return this.findById(db, id)
            });
    }
}