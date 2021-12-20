export enum CarSize { SMALL = 'small', MEDIUM = 'medium', LARGE = 'large' }

export interface Ticket {
    id: number;
    carPlateNo: string;
    carSize: CarSize;
    parkingLotId: number;
    isCheckout: boolean;
}