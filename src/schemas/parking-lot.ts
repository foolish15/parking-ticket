export enum ParkingLotStatus { AVAILABLE = 'available', INUSED = 'in-used' }

export interface ParkingLot {
    id: number;
    label: string;
    status: ParkingLotStatus;
}