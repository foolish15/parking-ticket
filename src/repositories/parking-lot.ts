import { Knex } from 'knex'
import { CarSize } from '../schemas/ticket'
import { ParkingLotStatus, ParkingLot } from '../schemas/parking-lot'

export interface Repository {
    list(db: Knex, status?: ParkingLotStatus, carSize?: CarSize): Promise<ParkingLot[]>
    findById(db: Knex, id: number, forUpdate?: boolean): Promise<ParkingLot>
    countWhereLabel(db: Knex, label: string): Promise<number>
    create(db: Knex, label: string): Promise<ParkingLot>
    updateStatus(db: Knex, id: number, status: ParkingLotStatus): Promise<ParkingLot>
}

export class ParkingLotRepo implements Repository {
    private table: string

    constructor() {
        this.table = "parking_lots";
    }

    public async list(db: Knex, status?: ParkingLotStatus, carSize?: CarSize): Promise<ParkingLot[]> {
        let select = db(this.table).select({ id: 'parking_lots.id', label: 'parking_lots.label', status: 'parking_lots.status', createdAt: 'parking_lots.created_at', updatedAt: 'parking_lots.updated_at' })
        if (typeof status !== "undefined" && status.toString() !== "") {
            select = select.where('status', '=', status)
        }
        if (typeof carSize !== "undefined" && carSize.toString() !== "") {
            select = select.join('tickets', 'parking_lots.id', 'tickets.parking_lot_id').where('tickets.car_size', '=', carSize).where('tickets.is_checkout', '=', false)
        }
        return await select
    }
    public async findById(db: Knex, id: number, forUpdate?: boolean): Promise<ParkingLot> {
        if (typeof forUpdate !== 'undefined' && forUpdate && db.isTransaction) {
            return await db(this.table)
                .forUpdate()
                .select({ id: 'id', label: 'label', status: 'status', createdAt: 'created_at', updatedAt: 'updated_at' })
                .where('id', '=', id)
                .first()
        }
        return await db(this.table)
            .select({ id: 'id', label: 'label', status: 'status', createdAt: 'created_at', updatedAt: 'updated_at' })
            .where('id', '=', id)
            .first()
    }
    public async countWhereLabel(db: Knex, label: string): Promise<number> {
        let cnt = 0
        return await db(this.table)
            .where('label', '=', label)
            .count({ count: '*' })
            .then((result) => {
                result.forEach((value) => {
                    cnt = value.count
                })
                return cnt
            })
    }
    public async create(db: Knex, label: string): Promise<ParkingLot> {
        const timestamp = db.raw('CURRENT_TIMESTAMP');
        return await db(this.table)
            .insert({
                'label': label,
                'status': ParkingLotStatus.AVAILABLE,
                'created_at': timestamp,
                'updated_at': timestamp
            })
            .then(async (result) => {
                let insertId: number
                result.forEach((value) => {
                    insertId = value
                })
                return await this.findById(db, insertId)
            });
    }

    public async updateStatus(db: Knex, id: number, status: ParkingLotStatus): Promise<ParkingLot> {
        const timestamp = db.raw('CURRENT_TIMESTAMP');
        return db(this.table)
            .where('id', '=', id)
            .update({
                'status': status,
                'updated_at': timestamp
            })
            .then(() => {
                return this.findById(db, id)
            });
    }
}