export interface FindUniqueArgs<T> {
    criteria: Partial<T>;
}

export interface UpdateArgs<T> {
    criteria: Partial<T>;
    data: Partial<T>;
}

export interface DeleteArgs<T> {
    criteria: Partial<T>;
}

export interface FindByFieldArgs<T, K extends keyof T> {
    field: K;
    value?: T[K];
    values?: T[K][];
}

export interface UpdateManyArgs<T> {
    records: (Omit<Partial<T>, 'id'> & { id: number })[];
}

export interface DeleteManyArgs {
    ids: Array<number | string>;
}

export default interface IDatabaseClient {
    connect(): Promise<void>;
    disconnect(): Promise<void>;

    findUnique<T>(model: string, args: FindUniqueArgs<T>): Promise<T>;
    findMany<T>(model: string, args: any): Promise<T[]>;
    findByField<T, K extends keyof T>(model: string, args: FindByFieldArgs<T, K>): Promise<T[]>;

    count(model: string, args: any): Promise<number>;

    create<T>(model: string, args: any): Promise<T>;
    createMany<T>(model: string, records: Omit<T, 'id'>[]): Promise<T[]>;

    update<T>(model: string, args: UpdateArgs<T>): Promise<T>;
    updateMany<T>(model: string, args: UpdateManyArgs<T>): Promise<T[]>;

    delete<T>(model: string, args: DeleteArgs<T>): Promise<T>;
    deleteMany<T>(model: string, args: DeleteManyArgs): Promise<T>;
}
