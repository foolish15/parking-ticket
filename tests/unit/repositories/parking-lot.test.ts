import { ParkingLotRepo } from '../../../src/repositories/parking-lot';
import { ParkingLotStatus } from '../../../src/schemas/parking-lot';
import { db } from '../../../src/util/db';
import mockDb from 'mock-knex';
import { CarSize } from '../../../src/schemas/ticket';

let tracker: mockDb.Tracker;

beforeAll(() => {
    mockDb.mock(db);
    tracker = mockDb.getTracker();
    tracker.install();
})
afterAll(() => {
    tracker.uninstall();
    mockDb.unmock(db);
})

test('list without status', async () => {
    const repo = new ParkingLotRepo();
    tracker.once('query', (query) => {
        expect(query.sql).toEqual('select `parking_lots`.`id` as `id`, `parking_lots`.`label` as `label`, `parking_lots`.`status` as `status`, `parking_lots`.`created_at` as `createdAt`, `parking_lots`.`updated_at` as `updatedAt` from `parking_lots`');
        query.response([
            {
                'id': 1,
                'label': 'A1',
                'status': ParkingLotStatus.AVAILABLE,
                'createdAt': Date,
                'updatedAt': Date
            },
            {
                'id': 2,
                'label': 'A2',
                'status': ParkingLotStatus.AVAILABLE,
                'createdAt': Date,
                'updatedAt': Date
            }
        ]);
    });
    const rsl = await repo.list(db);
    expect(rsl.length).toEqual(2);
    expect(rsl[0].id).toEqual(1);
});

test('list with status available', async () => {
    const repo = new ParkingLotRepo();
    tracker.once('query', (query) => {
        expect(query.sql).toEqual('select `parking_lots`.`id` as `id`, `parking_lots`.`label` as `label`, `parking_lots`.`status` as `status`, `parking_lots`.`created_at` as `createdAt`, `parking_lots`.`updated_at` as `updatedAt` from `parking_lots` where `status` = ?');
        query.response([
            {
                'id': 1,
                'label': 'A1',
                'status': ParkingLotStatus.AVAILABLE,
                'createdAt': Date,
                'updatedAt': Date
            },
            {
                'id': 2,
                'label': 'A2',
                'status': ParkingLotStatus.AVAILABLE,
                'createdAt': Date,
                'updatedAt': Date
            }
        ]);
    });
    const rsl = await repo.list(db, ParkingLotStatus.AVAILABLE);
    expect(rsl.length).toEqual(2);
    expect(rsl[0].id).toEqual(1);
});

test('list with status in-used', async () => {
    const repo = new ParkingLotRepo();
    tracker.once('query', (query) => {
        expect(query.sql).toEqual('select `parking_lots`.`id` as `id`, `parking_lots`.`label` as `label`, `parking_lots`.`status` as `status`, `parking_lots`.`created_at` as `createdAt`, `parking_lots`.`updated_at` as `updatedAt` from `parking_lots` inner join `tickets` on `parking_lots`.`id` = `tickets`.`parking_lot_id` where `status` = ? and `tickets`.`car_size` = ? and `tickets`.`is_checkout` = ?');
        query.response([
            {
                'id': 1,
                'label': 'A1',
                'status': ParkingLotStatus.INUSED,
                'createdAt': Date,
                'updatedAt': Date
            },
            {
                'id': 2,
                'label': 'A2',
                'status': ParkingLotStatus.INUSED,
                'createdAt': Date,
                'updatedAt': Date
            }
        ]);
    });
    const rsl = await repo.list(db, ParkingLotStatus.INUSED, CarSize.MEDIUM);
    expect(rsl.length).toEqual(2);
    expect(rsl[0].id).toEqual(1);
});

test('find by id', async () => {
    const repo = new ParkingLotRepo();
    tracker.once('query', (query) => {
        expect(query.sql).toEqual('select `id` as `id`, `label` as `label`, `status` as `status`, `created_at` as `createdAt`, `updated_at` as `updatedAt` from `parking_lots` where `id` = ? limit ?');
        query.response([
            {
                'id': 1,
                'label': 'A1',
                'status': ParkingLotStatus.AVAILABLE,
                'createdAt': Date,
                'updatedAt': Date
            }
        ]);
    });
    const rsl = await repo.findById(db, 1);
    expect(rsl.id).toEqual(1);
});

test('find by id and wait for update', async () => {
    const repo = new ParkingLotRepo();
    tracker.once('query', (query) => {
        expect(query.sql).toEqual('select `id` as `id`, `label` as `label`, `status` as `status`, `created_at` as `createdAt`, `updated_at` as `updatedAt` from `parking_lots` where `id` = ? limit ? for update');
        query.response([
            {
                'id': 1,
                'label': 'A1',
                'status': ParkingLotStatus.AVAILABLE,
                'createdAt': Date,
                'updatedAt': Date
            }
        ]);
    });

    db.isTransaction = true;
    const rsl = await repo.findById(db, 1, true);
    expect(rsl.id).toEqual(1);
});

test('count parking lot count with label', async () => {
    const repo = new ParkingLotRepo();
    tracker.once('query', (query) => {
        expect(query.sql).toEqual('select count(*) as `count` from `parking_lots` where `label` = ?');
        query.response([
            {
                count: 1,
            }
        ]);
    });
    const cnt = await repo.countWhereLabel(db, 'A1');
    expect(cnt).toEqual(1);
});

test('create wit label', async () => {
    const repo = new ParkingLotRepo();
    tracker
        .on('query', (query, step) => {
            if (step === 7) {
                expect(query.sql).toEqual('insert into `parking_lots` (`created_at`, `label`, `status`, `updated_at`) values (CURRENT_TIMESTAMP, ?, ?, CURRENT_TIMESTAMP)')
                query.response([1]);
            } else if (step === 8) {
                expect(query.sql).toEqual('select `id` as `id`, `label` as `label`, `status` as `status`, `created_at` as `createdAt`, `updated_at` as `updatedAt` from `parking_lots` where `id` = ? limit ?')
                query.response(
                    [
                        {
                            'id': 1,
                            'label': 'A1',
                            'status': ParkingLotStatus.AVAILABLE,
                            'createdAt': Date,
                            'updatedAt': Date
                        }
                    ]
                );
            }
        });
    const rsl = await repo.create(db, 'A1');
    expect(rsl.id).toEqual(1);
});

test('create wit label', async () => {
    const repo = new ParkingLotRepo();
    tracker
        .on('query', (query, step) => {
            if (step === 9) {
                expect(query.sql).toEqual('update `parking_lots` set `status` = ?, `updated_at` = CURRENT_TIMESTAMP where `id` = ?')
                query.response([1]);
            } else if (step === 10) {
                expect(query.sql).toEqual('select `id` as `id`, `label` as `label`, `status` as `status`, `created_at` as `createdAt`, `updated_at` as `updatedAt` from `parking_lots` where `id` = ? limit ?')
                query.response(
                    [
                        {
                            'id': 1,
                            'label': 'A1',
                            'status': ParkingLotStatus.AVAILABLE,
                            'createdAt': Date,
                            'updatedAt': Date
                        }
                    ]
                );
            }
        });
    const rsl = await repo.updateStatus(db, 1, ParkingLotStatus.AVAILABLE);
    expect(rsl.status).toEqual(ParkingLotStatus.AVAILABLE);
});