import PrismaDatabaseClient from '../database/PrismaClient';

const globalForDb = global as typeof global & {
    db?: PrismaDatabaseClient;
};

const db = globalForDb.db || new PrismaDatabaseClient();

if (!globalForDb.db) {
    globalForDb.db = db;
}

if (process.env.NODE_ENV !== 'production') {
    globalForDb.db = db;
}

export default db;
