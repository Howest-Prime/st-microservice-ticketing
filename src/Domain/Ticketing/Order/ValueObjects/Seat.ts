import { ValueObject } from '@/Domain/Shared/mod.ts';
import { InvalidSeatException } from '@/Domain/Ticketing/Order/mod.ts';

export enum VisitorTypeLabel{
    Standard = "Standard",
    Discounted = "Discounted"
}

export class Seat extends ValueObject {

    private readonly _seatNumber: number;
    private readonly _visitorsType: VisitorTypeLabel

    private constructor(seatNr: number, typeVisitor: VisitorTypeLabel) {
        super();
        this._seatNumber = seatNr;
        this._visitorsType = typeVisitor;
    }

    public static create(seatNr: number, typeVisitor: VisitorTypeLabel): Seat {
        const newSeat = new Seat(seatNr, typeVisitor);
        newSeat.validate();
        return newSeat;
    }

    private validate(): void {
        if(this._seatNumber <= 0){
            throw new InvalidSeatException(this._seatNumber);
        }
    }

    public override equals(other: Seat): boolean {
        return other instanceof Seat 
                    && this._seatNumber === other._seatNumber
                        && this._visitorsType === other._visitorsType;
    }

    public get seatNumber(): number {
        return this._seatNumber;
    }

    public get seatVisitorType(): VisitorTypeLabel {
        return this._visitorsType;
    }
}