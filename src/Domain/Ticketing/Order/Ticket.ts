import { Entity, UUIDEntityId } from '@/Domain/Shared/mod.ts';
import { MovieInfo, Seat, VisitorTypeLabel } from '@/Domain/Ticketing/Order/mod.ts';
import { Money, MovieId } from '@/Domain/Ticketing/Shared/mod.ts';


export class TicketId extends UUIDEntityId{
    private constructor(id?: string){
        super(id);
    }

    public static create(id?: string): TicketId {
        return new TicketId(id);
    }
}

export class Ticket extends Entity<TicketId> {

    private _movieInfo: MovieInfo;
    private _seat: Seat;
    private _room: string;
    private _price: Money
    private _showtime: Date

    private constructor(id:MovieId, movieInfo: MovieInfo, seat: Seat, room: string, showtime: Date){
        super(id);
        this._movieInfo = movieInfo;
        this._seat = seat;
        this._room = room;
        this._showtime = showtime;
        this._price = Money.create(this.calculatePrice(seat, movieInfo), "EUR");

    }

    public static create(movieInfo: MovieInfo, seat: Seat, room: string, showtime: Date): Ticket {
        return new Ticket(MovieId.create(), movieInfo, seat, room , showtime);
    }


    private calculatePrice(seat: Seat, movieInfo: MovieInfo): number{
        const isDiscountedVisitor =  seat.seatVisitorType === VisitorTypeLabel.Discounted;
        return isDiscountedVisitor ?  movieInfo.price.amount * 0.9 : movieInfo.price.amount;
    }

    public get movieInfo() : MovieInfo {
        return this._movieInfo;
    }

    public get seat(): Seat {
        return this._seat;
    }

    public get room(): string {
        return this._room;
    }

    public get price(): Money {
        return this._price;
    }

    public get showtime(): Date {
        return this._showtime;
    }

    
}