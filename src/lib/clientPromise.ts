import { MongoClient } from 'mongodb';

declare global {
    var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!process.env.MONGODB_URI) {
    throw new Error('Please add your Mongo URI to .env.NEXT_PUBLIC_local');
}

const uri: string = process.env.MONGODB_URI;
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NEXT_PUBLIC_NODE_ENV !== 'development') {
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    client = new MongoClient(uri);
    clientPromise = client.connect();
}

export default clientPromise;
