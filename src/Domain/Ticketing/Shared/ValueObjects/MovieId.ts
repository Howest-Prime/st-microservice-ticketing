import { UUIDEntityId } from '@/Domain/Shared/mod.ts';

export class MovieId extends UUIDEntityId {
    private constructor(id?: string) {
        super(id);
    }

    public static create(id?: string) {
        return new MovieId(id);
    }
}
